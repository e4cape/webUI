<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <!-- <el-button name="btnmultiCheckPrint" type="primary" @click="openDividend">新建</el-button> -->
          <el-button type="primary" :disabled="newKind.length == 0 ? true : false" v-if="newKind.length <= 1" style="margin-right: 15px;" @click="openDividend(newKind[0].Id)">新建</el-button>
          <el-dropdown @command="openDividend" name="newEndProduct" v-if="newKind.length > 1" style="margin-right: 15px;">
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
          <el-dropdown @command="reviewStyleOrder('批量审核')" name="btnMultiAudit">
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
            <el-select filterable name="State" v-model="queryForm.State" placeholder="所有" @change="onSearch">
              <el-option label="所有" value="0"></el-option>
              <el-option
                v-for="item in orderBasicState.TypeArray"
                :key="item.value"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SplitCode">
            <el-input
              name="SplitCode"
              v-model="queryForm.SplitCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item> 
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有位置：" prop="WarehouseId">
            <el-select
              filterable
              name="WarehouseId"
              v-model="queryForm.WarehouseId"
              placeholder="所有位置"
            >
              <el-option label="所有位置" value="0"></el-option>
              <el-option
                v-for="(item,index) in positionList"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select
              filterable
              name="KindTypeEk"
              v-model="queryForm.KindTypeEk"
              placeholder="所有种类"
            >
              <el-option label="所有种类" value="0"></el-option>
              <template v-for="(item,index) in kind">
                <el-option
                  v-if="item.State == YNStatus.Yes"
                  :key="index"
                  :label="item.Value"
                  :value="String(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="SplitCode" label="单据编号：">
            <el-input
              name="SplitCode"
              v-model="queryForm.SplitCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select
              filterable
              name="CreateUserId"
              v-model="queryForm.CreateUserId"
              placeholder="创建人"
            >
              <el-option label="全部" value="0"></el-option>
              <el-option
                v-for="(item,index) in createList"
                :key="index"
                :label="item.TrueName"
                :value="String(item.UserId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期：" prop="CreateTime">
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
          <el-form-item label="最后操作日期：" prop="CheckTime">
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
        prop="SplitCode"
        label="单据编号"
        min-width="140"
        show-overflow-tooltip
        sortable="custom"
        fixed
      ></el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="位置" min-width="80" show-overflow-tooltip >
        <template slot-scope="scope">{{scope.row.WarehouseName + '>' + scope.row.ShelfName}}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        min-width="120"
        show-overflow-tooltip
        sortable="custom"
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="ItemQty"
        label="分货数量"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="AllotoutQty" label="已调拨数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="最后操作时间"
        min-width="120"
        show-overflow-tooltip
        sortable="custom"
      >
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="Status" label="状态" min-width="80" show-overflow-tooltip>
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
            @click="viewStoreDividend(scope.row.SplitId)"
          >查看</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Draft ||scope.row.State == orderBasicState.Reject"
            name="editData"
            type="text"
            @click="editStoreDividend(scope.row.SplitId)"
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
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- 新建分货单 -->
    <el-dialog
      title="新建分货单"
      :visible.sync="dividendVisible"
      width="600px"
      @close="colseDividend"
      v-if="dividendVisible"
    >
      <el-form
        ref="newDividendOrder"
        :model="newDividendOrder"
        :rules="rules"
        lable-width="100px"
        class="item-lh-26"
        :inline="true"
      >
        <!-- <el-form-item label="货品种类：" prop="KindTypeEk">
          <el-select v-model="newDividendOrder.KindTypeEk" filterable>
            <template v-for="(item,index) in kind">
              <el-option
                v-if="item.State == YNStatus.Yes"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-form-item label="位置：" prop="WarehouseId">
            <el-select filterable v-model="newDividendOrder.WarehouseId" @change="warehouseChange">
              <el-option
                v-for="(item, index) in positionList"
                :key="index"
                :label="item.label"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShelfId">
            <el-select filterable v-model="newDividendOrder.ShelfId" :disabled="shelfList.length == 0">
              <el-option
                v-for="(item, index) in shelfList"
                :key="index"
                :label="item.Value"
                :value="Number(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" @blur="newDividendOrder.Note = newDividendOrder.Note.trim()" v-model="newDividendOrder.Note" :maxlength="200" name="Note" style="width: 300px" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="saveForm('newDividendOrder')"
          :loading="$store.getters.is_loading"
          name="btnEditModify"
        >保存</el-button>
        <el-button @click="colseDividend" name="btnCancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- end 新建分货单 -->
  </el-row>
</template>

<script>
import { YNStatus, StoreType } from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  StyleSplitOrderBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GETS,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CREATE,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECT,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDITS,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECTS,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
  MERCHANT_API_DROPDOWN_USERLIST
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
export default {
  data() {
    return {
      YNStatus,
      kind: [], // 种类
      newKind: [],
      orderBasicState: StyleSplitOrderBasicState, // 分货单状态
      storeType: StoreType, // 门店类型
      showType: 'stock', // 件数和金重
      desks: [], // 所有来源
      positionList: [], // 仓库下拉
      shelfList: [], // 货架下拉
      createList: [], // 创建人下拉
      queryForm: {
        // 查询表单数据
        WarehouseId: '0',
        State: '0',
        KindTypeEk: '0',
        SplitCode: '',
        CreateUserId: '0',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: '0',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      newDividendOrder: {
        KindTypeEk: '',
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      data: [],
      total: 0,
      dividendVisible: false, // 新建
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      auditDialog: false, // 审核弹窗
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 弹窗数据
      expandRows: [],
      parameters: {},
      rules: {
        KindTypeEk: [
          { required: true, message: '请选择货品种类', trigger: 'change' }
        ],
        WarehouseId: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        ShelfId: [{ required: true, message: '请选择货架', trigger: 'change' }]
      }
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            WarehouseId: '0',
            State: '0',
            KindTypeEk: '0',
            SplitCode: '',
            CreateUserId: '0',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            IsAsced: YNStatus.No,
            OrderBy: 0,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    // 创建时间
    createChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      // this.onSearch()
    },
    // 最后操作时间
    checkChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      // this.onSearch()
    },
    expandRow(row) {
      this.expandRows = row
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
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    openDividend(command) {
      this.newDividendOrder.KindTypeEk = command
      this.kind.map(item => {
        if (item.Id == command) {
          this.newDividendOrder.KindTypeEv = item.Value
        }
      })
      this.dividendVisible = true
    },
    colseDividend() {
      this.$refs['newDividendOrder'].resetFields()
      this.newDividendOrder.Note = ''
      this.dividendVisible = false
    },
    // 新建保存
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const kindObj = this.kind.find(
            item => item.Id == this.newDividendOrder.KindTypeEk
          )
          const para = {
            ...this.newDividendOrder,
            WarehouseId: Number(this.newDividendOrder.WarehouseId),
            ShelfId: Number(this.newDividendOrder.ShelfId),
            KindTypeEk: kindObj.Id,
            KindTypeEv: kindObj.Value
          }
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.onSearch()
              this.colseDividend()
              setTimeout(() => {
                this.editStoreDividend(res.data.Data)
              })
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
          this.newKind = res.data.Data.Rows.filter(
            item => item.State === YNStatus.Yes
          )
        }
      })
    },
    // 获取创建人拉下
    getCreateUserList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.createList = res.data.Data.Rows
        }
      })
    },

    // 获取仓库和货架列表
    getAllDepotList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.Yes }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.positionList = res.data.Data.Rows.map(item => {
              const obj = {
                ...item,
                label: item.Value,
                value: item.Id
              }
              if (obj.Childrens.length && obj.Childrens.length != 1) {
                obj.Childrens = item.Childrens.map(val => {
                  return {
                    ...val,
                    label: val.Value,
                    value: val.Id
                  }
                })
              }
              return obj
            })
          }
        }
      )
    },
    // 新建进货单选择仓库后
    warehouseChange() {
      const Shelf = this.positionList.find(item => {
        return item.Id == this.newDividendOrder.WarehouseId
      })
      this.newDividendOrder.ShelfId =
        Shelf.Childrens.length == 1 ?Shelf.Childrens[0].Id : ''
      this.shelfList = Shelf.Childrens
    },
    // 查看
    viewStoreDividend(id) {
      this.$router.push(`/purchase/storeDividend/viewStoreStyleDem?id=${id}`)
    },
    // 编辑
    editStoreDividend(id) {
      this.$router.push(`/purchase/storeDividend/editStoreStyleDem?id=${id}`)
    },
    // 打开审核和批量审核弹窗
    reviewStyleOrder(title, obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.SplitCode }] : []
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
      this.reviewData = [{ ...obj, orderNumber: obj.SplitCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        SplitId: this.reviewData[0].SplitId,
        CheckNote: note
      }
      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.SplitCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        SplitId: Number(this.reviewData[0].SplitId),
        CheckNote: data
      }

      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CANCEL(para).then(res => {
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
      this.reviewData = []
      this.visibleCan = false
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          SplitId: this.reviewData[0].SplitId,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDIT(para).then(res => {
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
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECT(para).then(res => {
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
        const para = {
          Items: [],
          CheckNote: data.auditReson
        }
        this.expandRows.map(item => {
          if (this.orderBasicState.Wait == item.State) {
            const obj = {
              SplitId: item.SplitId
            }
            para.Items.push(obj)
          }
        })
        if(para.Items.length == 0) {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('选择的数据里面没有可批量审核的')
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDITS(para).then(res => {
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
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECTS(para).then(res => {
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
    }
  },
  created() {},
  mounted() {
    this.init()
    this.getKind()
    this.getAllDepotList()
    this.getCreateUserList()
  },
  watch: {
    $route: 'init',
    // 'queryForm.WarehouseId': 'onSearch',
    // 'queryForm.State': 'onSearch',
    // 'queryForm.KindTypeEks': 'onSearch',
    // 'queryForm.PurchaseXpState': 'onSearch',
    // 'queryForm.SplitXpState': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    reviewDialog,
    obsolete,
    cancelReview
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  height: 38px;
}
</style>
