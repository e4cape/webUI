<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-dropdown @command="openNewOrderForm" type="primary">
              <el-button name="btnmultiCheckPrint" type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in kind"
                  :key="index"
                  :command="item.Id"
                >{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="State" v-model="queryForm.State" placeholder="所有">
              <el-option label="所有" value="0"></el-option>
              <el-option
                v-for="(item,index) in orderBasicState.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select filterable name="KindTypeEk" v-model="queryForm.KindTypeEk" placeholder="所有种类">
              <el-option label="所有种类" value="0"></el-option>
              <el-option
                v-for="(item,index) in kind"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有方式：" prop="PurchaseType">
            <el-select filterable name="PurchaseType" v-model="queryForm.PurchaseType" placeholder="所有方式">
              <el-option label="所有方式" value="0"></el-option>
              <el-option
                v-for="(item,index) in purchaseType.TypeArray"
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
          <el-form-item label="创建人：" prop="CreateUserId">
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
            ></el-date-picker>
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
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="进货方式" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
      </el-table-column>
      <el-table-column
        prop="ActualDate"
        label="业务日期"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="ItemQty"
        label="订单数量"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="ArriveQty"
        label="到货数量"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="Preprice" label="应付款" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ForwdDate" label="预计到货日期" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{orderBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnViewData" type="text" @click="viewOrderForm(scope.row.PurchaseId)">查看</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Draft || scope.row.State == orderBasicState.Wait ||scope.row.State == orderBasicState.Reject"
            name="editData"
            type="text"
            @click="editOrderForm(scope.row.PurchaseId)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Wait"
            name="btnWaitData"
            type="text"
            @click="reviewStyleOrder(scope.row)"
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
    <el-dialog title="新建款式订货单" :visible.sync="newVisible" width="500px" @close="closeNewForm">
      <el-form :model="newStyleData" label-width="120px" :rules="newRules" ref="newForm">
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            :clearable="false"
            name="ActualDate"
            v-model="newStyleData.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="进货方式：" prop="PurchaseType">
          <el-radio-group name="PurchaseType" v-model="newStyleData.PurchaseType">
            <el-radio
              :label="Number(purchaseType.Purchase)"
            >{{purchaseType.Types[purchaseType.Purchase]}}</el-radio>
            <el-radio
              :label="Number(purchaseType.WeiwStuff)"
            >{{purchaseType.Types[purchaseType.WeiwStuff]}}</el-radio>
          </el-radio-group>
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
          <el-input name="Note" type="textarea" v-model="newStyleData.Note"></el-input>
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
    <!-- <review-Dialog :auditDialog="auditDialog" title="审核" :data="operatingData" v-if="auditDialog"  @confirmClick="confirmAudit" @cancelClick="cancelAudit"></review-Dialog> -->
    <el-dialog
      title="审核"
      :visible.sync="auditDialog"
      width="500px"
      @close="cancelAudit"
      v-if="auditDialog"
    >
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="operatingData.length === 1">
          <el-col :span="8">
            <el-form-item label="单据编号：">
              <span>{{operatingData[0].orderNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="创建：">
              <span>{{operatingData[0].CreateUser + '&nbsp;&nbsp;&nbsp;' + schemeDate(operatingData[0].CreateTime)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="returnInfo.auditType" name="auditType">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-radio :label="YNStatus.Yes">审核通过</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-radio :label="YNStatus.No" style="padding-top: 10px;">审核退回</el-radio>
              </el-col>
              <el-col :span="16" v-show="returnInfo.auditType === YNStatus.No">
                <el-input
                  v-model="returnInfo.auditReson"
                  placeholder="退回原因备注"
                  :maxlength="200"
                  name="auditReson"
                ></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <div
          v-if="returnInfo.auditType == YNStatus.Yes && supplierList.length > 1 && operatingData[0].Preprice"
        >
          <div class="colorRed">
            <div>该单需要按供应商拆成多个单据，请为每个供应商设置应付款：</div>
            <div>
              总共应付款为：
              <span>{{operatingData[0].Preprice}}</span>
            </div>
          </div>
          <el-form-item
            v-for="(item,index) in supplierList"
            :label="item.name + '：'"
            label-width="130"
            :key="index"
          >
            <el-input
              v-model="item.Preprice"
              placeholder="应付款"
              maxlength="10"
              name="auditReson"
              @keyup.native="item.Preprice = $root.toFixed(item.Preprice, 2, true)"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmAudit"
          :loading="$store.getters.is_loading"
          name="btnAuditStockloss"
        >确 定</el-button>
        <el-button @click="cancelAudit" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
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
import { YNStatus, PurchaseType } from '@/enums/common.js'
import {
  StylePurchaseOrderBasicState,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CREATE,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECT,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant.js'
import { SecurityUserState } from '@/enums/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'
import dayjs from 'dayjs'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      SecurityUserState,
      orderBasicState: StylePurchaseOrderBasicState, // 订货单状态
      purchaseType: PurchaseType, // 进货方式
      kind: [], // 种类下拉
      buyerList: [], // 创建人下拉
      supplierRow: [], // 供应商列表
      YNStatus,
      queryForm: {
        // 查询表单数据
        State: '0',
        KindTypeEk: '0',
        PurchaseType: '0',
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
        KindTypeEk: '',
        KindTypeEv: '',
        PurchaseType: PurchaseType.Purchase,
        Preprice: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        ForwdDate: dayjs().format('YYYY-MM-DD'),
        Note: ''
      }, // 新建数据
      newRules: {
        PurchaseType: [
          { required: true, message: '请选择进货方式', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        ForwdDate: [
          { required: true, message: '请选择预计到货日期', trigger: 'change' }
        ],
      }, // 新建验证
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date() - 8.64e7
        }
      },
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }, // 审核信息
      supplierList: [] // 点击审核供应商信息
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            State: '0',
            KindTypeEk: '0',
            PurchaseType: '0',
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
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        console.log(res)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.data.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取供应商下拉
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
          this.supplierRow = res.data.Data.Rows
        }
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'SplitCode':
          this.queryForm.OrderBy = 2
          break
        case 'ItemQty':
          this.queryForm.OrderBy = 4
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
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
    // 新建打开
    openNewOrderForm(command) {
      this.newStyleData.KindTypeEk = command
      this.kind.map(item => {
        if (item.Id == command) {
          this.newStyleData.KindTypeEv = item.Value
        }
      })
      this.newVisible = true
    },
    // 新建保存
    newSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newStyleData,
            PurchaseType: Number(this.newStyleData.PurchaseType),
            KindTypeEk: Number(this.newStyleData.KindTypeEk),
            Preprice: Number(this.newStyleData.Preprice)
          }
          STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.closeNewForm()
              setTimeout(() => {
                this.$router.push(
                  `/purchase/orderManagement/editStyleOrder?id=${res.data.Data}`
                )
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
      this.$router.push(`/purchase/orderManagement/viewStyleOrder?id=${id}`)
    },
    editOrderForm(id) {
      this.$router.push(`/purchase/orderManagement/editStyleOrder?id=${id}`)
    },
    // 打开作废
    openObsolete(obj) {
      this.operatingData = [{ ...obj, orderNumber: obj.PurchaseId }]
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
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_ABANDON(para).then(res => {
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
    // 审核弹窗打开
    reviewStyleOrder(obj) {
      const arr = obj.SplitPartnerIds.split(',')
      this.supplierList = arr.map(item => {
        const str = item.split(':')
        return { Preprice: str[0], name: str[1] }
      })
      console.log(this.supplierList)
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.PurchaseId }] : []
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit() {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: this.returnInfo.auditReson
      }
      if (
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.operatingData[0].Preprice
      ) {
        this.supplierList.map(item => {
          this.supplierRow.map(val => {
            if (item.name == val.Value) {
              item.PartnerId = val.Id
            }
          })
        })
        para.Items = this.supplierList.map(item => {
          return { Preprice: item.Preprice, PartnerId: item.PartnerId }
        })
      }
      console.log(para)
      this.$store.commit('SET_BTN_LOADING', true)
      if (YNStatus.Yes === this.returnInfo.auditType) {
        STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.cancelAudit()
            this.onSearch()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === this.returnInfo.auditType) {
        STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.cancelAudit()
            this.onSearch()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    // 关闭审核
    cancelAudit() {
      this.operatingData = []
      this.supplierList = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.PurchaseId }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: data
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CANCEL(para).then(res => {
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
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取员工
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
    this.getKind()
    this.getSupplierList()
    this.getBuyerList()
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    $route: 'init',
    'queryForm.PurchaseType': 'onSearch',
    'queryForm.KindTypeEk': 'onSearch',
    'queryForm.State': 'onSearch',
    'queryForm.CreateUserId': 'onSearch'
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
