<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <!-- <el-button type="primary" @click="newEndProduct">新建</el-button> -->
          <el-button type="primary" :disabled="newKind.length == 0 ? true : false" v-if="newKind.length <= 1" style="margin-right: 15px;" @click="newEndProduct(newKind[0].Id)">新建</el-button>
          <el-dropdown @command="newEndProduct" name="newEndProduct" v-if="newKind.length > 1" style="margin-right: 15px;">
            <el-button type="primary">
              新建
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item,index) in newKind">
              <el-dropdown-item
                v-if="item.State === YNStatus.Yes"
                :key="index"
                :command="item.Id"
                style="min-width: 80px; text-align: center;"
              >{{item.Value}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="showAuditDialog('批量审核')" name="btnMultiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="expandRows == 0">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="status" v-model="queryForm.State" placeholder="所有状态" filterable>
              <el-option label="所有状态" value="0"></el-option>
              <el-option
                v-for="item in orderBasicState.TypeArray"
                :key="item.value"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
            
          </el-form-item>
          <el-form-item prop="ModifyCode">
            <el-input
              name="ModifyCode"
              v-model="queryForm.ModifyCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
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
          <el-form-item
            label="所有原因："
            prop="ReasonTypeDk"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >
            <el-select name="ReasonTypeDk" v-model="queryForm.ReasonTypeDk" placeholder="所有原因" filterable>
              <el-option label="所有原因" value="0"></el-option>
              <el-option
                v-for="(item, index) in reasonsList"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ModifyCode" label="单据编号：">
            <el-input
              name="ModifyCode"
              v-model="queryForm.ModifyCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="全部" filterable>
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
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
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkChange"
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
      @sort-change="querySort"
      @selection-change="expandRow"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="ModifyCode"
        label="单据编号"
        sortable="custom"
        min-width="140"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        label="创建时间"
        sortable="custom"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="条码数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ReasonTypeDv" label="修改原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="CheckTime"
        label="最后操作时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
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
          <el-button
            name="btnShowDetail"
            type="text"
            @click="viewArrivalOrder(scope.row.ModifyId)"
          >查看</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="linkEditPage(scope.row.ModifyId)"
          >编辑</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="openObsolete(scope.row)"
          >作废</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Wait == scope.row.State"
            @click="showAuditDialog('审核',scope.row)"
          >审核</el-button>
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
    <el-dialog
      v-if="newVisible"
      title="新建修改单"
      :visible.sync="newVisible"
      width="600px"
      :before-close="newOrderDialogColse"
    >
      <el-form
        :model="newPurchaseOrder"
        :rules="newOrderRules"
        ref="newOrder"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
        <div>
          <el-form-item label="修改原因：" prop="ReasonTypeDk">
            <el-select
              name="ReasonTypeDk"
              v-model="newPurchaseOrder.ReasonTypeDk"
              placeholder="请选择"
              @change="reasonTypeChange"
              filterable
            >
              <el-option
                v-for="(item, index) in reasonsList"
                :key="index"
                :label="item.Value"
                :value="Number(item.Id)"
              ></el-option>
            </el-select>
            <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
              <i class="icon-set"></i>
            </span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" v-model="newPurchaseOrder.Note"  @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 审核 -->
    <review-Dialog
      v-if="auditDialog"
      :auditDialog="auditDialog"
      :title="reviewTitle"
      :data="reviewData"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- @module Dialog·新建修改原因 -->
    <dict-manage
      :visible.sync="reasonDialog"
      :dicts="reasonsList"
      dialogTitle="退货原因"
      :dictType="SettingDictionaryDictType.GoodsModifyOrderBasicReasonType"
      @listenDictSave="getReturn"
    ></dict-manage>
    <!-- End Dialog·新建修改原因  -->
  </el-row>
</template>

<script>
import {
  GoodsModifyOrderBasicState,
  SettingCustomizedFieldOrderType,
  SettingDictionaryDictType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  SecurityUserState
} from '@/enums/merchant.js'
import { CharacterType, YNStatus, EnableState } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDITS,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECTS
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      YNStatus,
      SecurityUserState,
      SettingDictionaryDictType,
      characterType: CharacterType,
      orderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
      orderBasicState: GoodsModifyOrderBasicState, // 入库状态
      buyerList: [], // 采购员下拉
      reasonsList: [], // 原因下拉
      queryForm: {
        // 查询表单数据
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        ReasonTypeDk: '0',
        KindTypeEk: '0',
        ModifyCode: '',
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
        KindTypeEk: '',
        KindTypeEv: '',
        Note: ''
      }, // 新建成品入库单
      expandRows: [],
      parameters: {},
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 弹窗数据
      newOrderRules: {
        ReasonTypeDk: [
          { required: true, message: '请选择退货原因', trigger: 'change' }
        ]
      },
      reasonDialog: false, // 新建修改原因弹窗
      newKind: [],
      kind: [],
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            CheckTime1: '',
            CheckTime2: '',
            State: '0',
            ReasonTypeDk: '0',
            KindTypeEk: '0',
            ModifyCode: '',
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
      STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS(this.queryForm).then(res => {
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
        case 'ModifyId':
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
        path: '/purchase/batchEditGoods/modifyCheck',
        query: { id }
      })
    },
    // 跳转编辑
    linkEditPage(id) {
      this.$router.push({
        path: '/purchase/batchEditGoods/modifyEdit',
        query: { id }
      })
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
        DictType: SettingDictionaryDictType.GoodsModifyOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasonsList = res.data.Data.Rows
        }
      })
    },
    // 打开新建弹窗
    newEndProduct(command) {
      this.newPurchaseOrder.KindTypeEk = command
      this.newKind.map(item => {
        if (item.Id == command) {
          this.newPurchaseOrder.KindTypeEv = item.Value
        }
      })
      this.newVisible = true
    },
    // 打开审核和批量审核弹窗
    showAuditDialog(title, obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.ModifyCode }] : []
      this.reviewTitle = title || ''
      if(title === '批量审核') {
        if (this.expandRows.filter(item => {
          if (item.State !== this.orderBasicState.Wait) {
            return item
          }
        }).length > 0) {
          return this.$message.error('请选择待审核的单据')
        }
      }
      this.auditDialog = true
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开作废
    openObsolete(obj) {
      this.reviewData = [{ ...obj, orderNumber: obj.ModifyCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ModifyId: this.reviewData[0].ModifyId,
        CheckNote: note
      }
      STOCKING_API_GOODS_MODIFY_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
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
            KindTypeEk: Number(this.newPurchaseOrder.KindTypeEk),
            ReasonTypeDk: Number(this.newPurchaseOrder.ReasonTypeDk)
          }
          STOCKING_API_GOODS_MODIFY_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.newVisible = false
              setTimeout(() => {
                this.linkEditPage(res.data.Data, this.orderType)
              }, 500)
            }
          })
        }
      })
    },
    // 退货原因
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
      this.shelfList = []
      this.newVisible = false
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          ModifyId: this.reviewData[0].ModifyId,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDIT(para).then(res => {
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
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECT(para).then(res => {
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
      } else if (this.reviewTitle == '批量审核') {
        if (this.expandRows.some((res) =>{
          return res.State != this.orderBasicState.Wait
        })) {
          this.$store.commit('SET_BTN_LOADING', false)
          this.$message.error('请选择待审核的批量修改货品单!')
          return false
        }
        const para = {
          Items: [],
          CheckNote: data.auditReson
        }
        this.expandRows.map(item => {
          if (this.orderBasicState.Wait == item.State) {
            const obj = {
              ModifyId: item.ModifyId
            }
            para.Items.push(obj)
          }
        })
        if(para.Items.length === 0) {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('请选择待审核的单据')
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDITS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核通过成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECTS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核退回成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      }
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
          this.newKind = res.data.Data.Rows.filter(item => item.State === YNStatus.Yes)
        }
      })
    },
  },
  created() {},
  mounted() {
    this.getReturn()
    this.getBuyerList()
    this.getKind()
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
.el-form-item {
  margin-bottom: 15px;
}
</style>
