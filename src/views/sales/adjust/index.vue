<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialog = true" name="btnCreateDialog">新建</el-button>
          <el-dropdown class="multi-operation" @command="showAllCheck" name="multiAudit">
            <el-button>
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="data.length">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" :value="''"></el-option>
              <el-option
                v-for="item in goodsPriceOrderBasicStates.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PriceCode">
            <el-input
              v-model="queryForm.PriceCode"
              placeholder="单据编号"
              @keyup.enter.native="onSearch"
              name="priceCode"
            >
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="ReasonTypeDk" label="所有原因：">
            <el-select
              v-model="queryForm.ReasonTypeDk"
              placeholder="所有原因"
              :filterable="true"
              name="ReasonTypeDk"
            >
              <el-option label="所有原因" :value="''"></el-option>
              <el-option
                v-for="(item,index) in adjustReasons"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PriceCode" label="单据编号：">
            <el-input
              v-model="queryForm.PriceCode"
              @keyup.enter.native="onSearch"
              :maxlength="50"
              name="priceCode"
            ></el-input>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select
              v-model="queryForm.CreateUserId"
              :filterable="true"
              placeholder="全部"
              name="createUserId"
            >
              <el-option label="全部" :value="''"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.users"
                v-if="item.TrueName"
                :key="index"
                :label="item.TrueName"
                :value="String(item.UserId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker
              v-model="queryForm.CreateTime"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              name="createTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker
              v-model="queryForm.CheckTime"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              name="checkTime"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table
      :data="data"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="PriceCode"
        label="单据编号"
        min-width="160"
        sortable="custom"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调价原因" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        min-width="160"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="调价条码数" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="CheckTime"
        label="最后操作时间"
        min-width="160"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.CheckTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <template
            v-if="(scope.row.State === goodsPriceOrderBasicStates.Abandon || scope.row.State === goodsPriceOrderBasicStates.Reject) && scope.row.CheckNote"
          >
            <el-tooltip class="item" effect="light" :content="scope.row.CheckNote" placement="top">
              <span class="red">{{goodsPriceOrderBasicStates.Types[scope.row.State]}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span
              :class="{'red': scope.row.State === goodsPriceOrderBasicStates.Abandon || scope.row.State === goodsPriceOrderBasicStates.Reject, 'green': scope.row.State === goodsPriceOrderBasicStates.Audit}"
            >{{goodsPriceOrderBasicStates.Types[scope.row.State]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link
            :to="{path:'/sales/adjust/adjustCheck',query:{id:scope.row.PriceId}}"
            class="btn-link el-button el-button--text"
            name="btnDetail"
          >查看</router-link>
          <template
            v-if="scope.row.State === goodsPriceOrderBasicStates.Reject || scope.row.State === goodsPriceOrderBasicStates.Draft"
          >
            <router-link
              :to="{path:'/sales/adjust/adjustEdit',query:{id:scope.row.PriceId}}"
              class="btn-link el-button el-button--text"
              name="btnEdit"
            >编辑</router-link>
            <el-button type="text" @click="adjustAbandon(scope.row)" name="btnAdjustAbandon">作废</el-button>
          </template>
          <el-button
            type="text"
            @click="adjustAudit(scope.row)"
            v-if="scope.row.State === goodsPriceOrderBasicStates.Wait"
            name="btnAdjustAudit"
          >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>

    <!-- @module Dialog·新建成品调价单 -->
    <el-dialog title="新建成品调价单" :visible.sync="createDialog" @close="resetForm">
      <el-form
        label-position="right"
        label-width="100px"
        :model="createForm"
        :rules="rules"
        ref="createForm"
      >
        <el-form-item label="调价原因" prop="ReasonTypeDk">
          <el-select
            v-model="createForm.ReasonTypeDk"
            :filterable="true"
            placeholder="请选择"
            name="ReasonTypeDk"
            @change="getAdjustReasonValue"
          >
            <el-option
              v-for="(item, index) in adjustReasons"
              :key="index"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="createForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="createAdjust"
          :loading="$store.getters.is_loading"
          name="btnCreateAdjust"
        >确 定</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品调价单 -->

    <!-- @module Dialog·新建调价原因 -->
    <dict-manage
      v-if="reasonDialog"
      :visible.sync="reasonDialog"
      :dicts="adjustReasons"
      dialogTitle="调价原因"
      :dictType="settingDictionaryDictTypes.GoodsPriceOrderBasicReasonType"
      @listenDictSave="getAdjustReason"
    ></dict-manage>
    <!-- End Dialog·新建调价原因  -->

    <!-- @module Dialog·审核 -->
    <adjust-audit
      title="审核"
      v-if="auditDialog"
      :auditDialog="auditDialog"
      :data="selections"
      @listenAuditDialog="listenAuditDialog"
    ></adjust-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <adjust-abandon
      title="作废"
      v-if="abandonDialog"
      :abandonDialog="abandonDialog"
      :abandonAdjust="abandonAdjust"
      @listenAbandonDialog="listenAbandonDialog"
    ></adjust-abandon>
    <!-- End Dialog·作废 -->
    <!-- @module 批量审核 -->
    <el-dialog title="批量审核" :visible.sync="allCheck" width="580px">
      <div class="option">
        <span class="item">审核结果：</span>
        <el-radio-group name="isCheck" v-model="isCheck">
          <el-radio :label="goodsPriceOrderBasicStates.Audit">审核通过</el-radio>
          <el-radio :label="goodsPriceOrderBasicStates.Reject">审核退回</el-radio>
          <el-input
            name="checkNote"
            style="width:178px;"
            v-model="checkNote"
            :disabled="isCheck === goodsPriceOrderBasicStates.Audit"
            placeholder="退回原因备注"
          ></el-input>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnBatchAudit" type="primary" @click="batchAudit">确定</el-button>
        <el-button name="btnClose" @click="allCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 批量审核 -->
  </div>
</template>

<script>
import { YNStatus, EnableState } from '@/enums/common.js'
import {
  GoodsPriceOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDITS,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECTS
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import adjustAbandon from './adjustAbandon'
import adjustAudit from './adjustAudit'
export default {
  data() {
    return {
      YNStatus,
      goodsPriceOrderBasicStates: GoodsPriceOrderBasicState,
      settingDictionaryDictTypes: SettingDictionaryDictType,
      queryForm: {
        // 查询表单数据
        CreateTime: '',
        CheckTime: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 1,
        IsAsced: YNStatus.No,
        ReasonTypeDk: '',
        PriceCode: '',
        CreateUserId: '',
        State: ''
      },
      adjustReasons: [], // 调价原因
      data: [],
      total: 0,
      allCheck: false, // 批量审核
      isCheck: 5, // 批量审核结果
      checkNote: '', // 批量退货原因
      selectedProductId: [], // 选中的单据Id
      selectedProduct: [], // 选中的单据
      selections: {}, // 选中的单据
      createDialog: false, // 新建对话框
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonAdjust: {}, // 作废调价单
      reasonDialog: false, // 新建调价原因对话框
      reasonName: '调价原因',
      createOrEdit: true,
      createForm: {
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: ''
      },
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择原因',
            trigger: 'change'
          }
        ]
      },
      parameters: {}
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.parameters.State = query.State || ''
      this.parameters.ReasonTypeDk = query.ReasonTypeDk || ''
      this.parameters.CreateUserId = query.CreateUserId || ''
      this.parameters.PriceCode = query.PriceCode || ''
      this.parameters.OrderBy = query.OrderBy || 1
      this.parameters.IsAsced = query.IsAsced || YNStatus.No
      this.parameters.PageIndex = query.PageIndex || 1
      this.parameters.PageSize = query.PageSize || 20
      this.getData()
    },
    getCreators() {
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameters, {
        CreateTime1: this.parameters.CreateTime[0],
        CreateTime2: this.parameters.CreateTime[1],
        CheckTime1: this.parameters.CheckTime[0],
        CheckTime2: this.parameters.CheckTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_PRICE_ORDER_BASIC_GETS(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'PriceCode':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 1
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selectedProduct = selection
      this.selectedProductId = []
      selection.forEach(item => {
        this.selectedProductId.push({ PriceId: item.PriceId })
      })
    },
    createAdjust() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_PRICE_ORDER_BASIC_CREATE(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
                this.$store.commit('SET_BTN_LOADING', false)
                this.$router.push({
                  path: '/sales/adjust/adjustEdit',
                  query: {
                    id: res.data.Data
                  }
                })
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    showAllCheck() {
      if (
        this.selectedProduct.filter(
          item => item.State !== this.goodsPriceOrderBasicStates.Wait
        ).length !== 0
      ) {
        return this.$message.error('请选择待审核的单据')
      } else {
        this.allCheck = true
      }
    },
    adjustAudit(row) {
      this.selections = row
      this.auditDialog = true
    },
    batchAudit() {
      // 批量审核、退回
      if (this.isCheck === this.goodsPriceOrderBasicStates.Audit) {
        STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDITS({
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核成功')
            this.allCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECTS({
          CheckNote: this.checkNote,
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核退回成功')
            this.allCheck = false
            this.getData()
          }
        })
      }
    },
    adjustAbandon(row) {
      this.abandonDialog = true
      this.abandonAdjust = row
    },
    getAdjustReasonValue(id) {
      this.createForm.ReasonTypeDv = this.adjustReasons.find(
        item => item.Id === id
      ).Value
    },
    getAdjustReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes
          .GoodsPriceOrderBasicReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.adjustReasons = res.data.Data.Rows || []
        }
      })
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getData()
      }
      this.abandonDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.selections = []
        this.getData()
      }
      this.auditDialog = false
    },
    resetForm() {
      this.createForm = {
        ReasonTypeDk: '',
        Note: ''
      }
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
        query: this.parameters
      })
    }
  },
  mounted() {
    this.init()
    this.getCreators()
    this.getAdjustReason()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    dictManage,
    adjustAudit,
    adjustAbandon
  }
}
</script>
