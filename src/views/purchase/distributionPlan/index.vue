<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="openPlanDialog">新建</el-button>
          <el-dropdown @command="showAuditDialog('批量审核')" name="btnMultiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="expandRows.length == 0">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="State" v-model="queryForm.State" placeholder="所有">
              <el-option label="所有" :value="0"></el-option>
              <el-option v-for="(item,index) in orderBasicState.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PlanCode">
            <el-input name="PlanCode" v-model="queryForm.PlanCode" :maxlength="50" @keyup.enter.native="onSearch" placeholder="单据编号">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="PlanCode" label="单据编号：">
            <el-input name="PlanCode" v-model="queryForm.PlanCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="PlanName" label="计划名称：">
            <el-input name="PlanName" v-model="queryForm.PlanName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createTimeChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="PartnerName" label="供应商：">
            <el-input name="PartnerName" v-model="queryForm.PartnerName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select filterable name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="创建人">
              <el-option label="全部" :value="0"></el-option>
              <template v-for="(item, index) in buyerList">
                <el-option v-if="item.UserState === SecurityUserState.Audit" :key="index" :label="item.TrueName" :value="Number(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="最后操作日期：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkTimeChange"
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
    <el-table :data="data" element-loading-text="拼命加载中" @sort-change="querySort" @selection-change="expandRow" v-loading="$store.getters.tb_loading">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="PlanCode" label="单据编号" min-width="140" show-overflow-tooltip sortable="custom" fixed></el-table-column>
      <el-table-column prop="PlanName" label="计划名称" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="CreateTime" min-width="100" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.CreateTime | filterDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="数量" min-width="80" show-overflow-tooltip sortable="custom"></el-table-column>
      <el-table-column prop="Price" label="预估金额" min-width="100" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">{{$root.toFloat(scope.row.Price)}}</template>
      </el-table-column>
      <el-table-column label="最后操作时间" min-width="120" show-overflow-tooltip sortable="custom" prop="CheckTime">
        <template slot-scope="scope">
          <span>{{scope.row.CheckTime | filterDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip placement="top" v-if="(scope.row.State === orderBasicState.Reject || scope.row.State === orderBasicState.Abandon) && scope.row.CheckNote">
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span :class="{'red': scope.row.State >= orderBasicState.Reject,'green': scope.row.State === orderBasicState.Audit}">{{orderBasicState.Types[scope.row.State] || '-'}}</span>
          </el-tooltip>
          <span :class="{'red': scope.row.State >= orderBasicState.Reject,'green': scope.row.State === orderBasicState.Audit}" v-else>{{orderBasicState.Types[scope.row.State] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnShowDetail" type="text" @click="viewArrivalOrder(scope.row.PlanId)">查看</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State" @click="linkEditPage(scope.row.PlanId)">编辑</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State" @click="openObsolete(scope.row)">作废</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Wait == scope.row.State" @click="showAuditDialog('审核',scope.row)">审核</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Audit == scope.row.State" @click="openCancelReview(scope.row)">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- end 货品详情-->
    <!-- 审核 -->
    <review-Dialog v-if="auditDialog" :auditDialog="auditDialog" :title="reviewTitle" :data="reviewData" @confirmClick="confirmAudit" @cancelClick="cancelAudit"></review-Dialog>
    <!-- 作废 -->
    <obsolete v-if="obsoleteVisble" @visbleColse="visbleColse" @confirmObsolete="confirmObsolete" :data="reviewData" :visibleObs="obsoleteVisble"></obsolete>
    <!-- 取消审核 -->
    <cancel-Review :visibleCan="visibleCan" :data="reviewData" v-if="visibleCan" @confirmCancel="cancelConfirm" @visbleColse="cancelColse"></cancel-Review>
    <!-- 新建 -->
    <el-dialog title="创建配货计划" :visible.sync="newVisible" width="500px" @close="colseNewPlan">
      <el-form :model="planForm" ref="planForm" :rules="rule" @submit.native.prevent>
        <el-form-item prop="PlanName" label="计划名称：（20字以内）">
          <el-input v-model="planForm.PlanName" name="PlanName" style="width:100%;" maxlength="20" @keyup.enter.native="confirmNewPlan('planForm')"></el-input>
        </el-form-item>
        <el-form-item prop="Note" label="备注：">
          <el-input v-model="planForm.Note" name="Note" type="textarea" style="width:100%;" resize="none" maxlength="200" @keyup.enter.native="confirmNewPlan('planForm')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" name="btnAuditStockloss" @click="confirmNewPlan('planForm')">确 定</el-button>
        <el-button name="btnCancel" @click="colseNewPlan">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { SecurityUserState } from '@/enums/merchant.js'
import { GoodsReinfPlanBasicState } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_REINF_PLAN_BASIC_GETS,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_ABANDON,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_CANCEL,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDIT,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECT,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDITS,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECTS,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_CREATE
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_USERLIST } from '@/apis/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
export default {
  data() {
    return {
      SecurityUserState,
      YNStatus,
      orderBasicState: GoodsReinfPlanBasicState, // 配货计划状态
      showType: 'stock', // 件数和金重
      desks: [], // 所有来源
      queryForm: {
        // 查询表单数据
        State: 0,
        PlanCode: '',
        PlanName: '',
        PartnerName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CreateUserId: 0,
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      auditDialog: false, // 审核弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      newVisible: false, // 新建弹窗
      reviewData: [], // 弹窗数据
      reviewTitle: '', // 审核弹窗标题
      buyerList: [], // 创建人下拉
      expandRows: [],
      parameters: {},
      planForm: {
        PlanName: '',
        Note: ''
      }, // 新建参数
      rule: {
        PlanName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ]
      } // 新建验证
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? {
            ...this.$route.query,
            State: Number(this.$route.query.State),
            CreateUserId: Number(this.$route.query.CreateUserId)
          }
          : {
            State: 0,
            PlanCode: '',
            PlanName: '',
            PartnerName: '',
            CreateTime: [],
            CreateTime1: '',
            CreateTime2: '',
            CreateUserId: 0,
            CheckTime: [],
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
      STOCKING_API_GOODS_REINF_PLAN_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'PlanCode':
          this.queryForm.OrderBy = 1
          break
        case 'ItemQty':
          this.queryForm.OrderBy = 2
          break
        case 'Price':
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
    createTimeChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    checkTimeChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(val) {
      this.expandRows = val
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
    // 新建
    openPlanDialog() {
      this.newVisible = true
    },
    // 确定新建
    confirmNewPlan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_REINF_PLAN_BASIC_CREATE(this.planForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: '新建成功',
                  type: 'success'
                })
                this.colseNewPlan()
                this.linkEditPage(res.data.Data)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        }
      })
    },
    // 关闭新建
    colseNewPlan() {
      this.$refs['planForm'].resetFields()
      this.newVisible = false
    },
    viewArrivalOrder(id) {
      this.$router.push({
        path: '/purchase/distributionPlan/viewDistributionPlan',
        query: { id }
      })
    },
    // 跳转编辑
    linkEditPage(id) {
      this.$router.push({
        path: '/purchase/distributionPlan/editDistributionPlan',
        query: { id }
      })
    },
    // 打开审核和批量审核弹窗
    showAuditDialog(title, obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.PlanCode }] : []
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
      this.reviewData = [{ ...obj, orderNumber: obj.PlanCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        PlanId: this.reviewData[0].PlanId,
        CheckNote: note
      }
      STOCKING_API_GOODS_REINF_PLAN_BASIC_ABANDON(para).then(res => {
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
    // 打开取消审核
    openCancelReview(obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.PlanCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PlanId: Number(this.reviewData[0].PlanId),
        CheckNote: data
      }
      STOCKING_API_GOODS_REINF_PLAN_BASIC_CANCEL(para).then(res => {
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
          PlanId: this.reviewData[0].PlanId,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDIT(para).then(res => {
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
          STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECT(para).then(res => {
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
              PlanId: item.PlanId
            }
            para.Items.push(obj)
          }
        })
        if(para.Items.length === 0) {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('请选择待审核的单据')
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDITS(para).then(res => {
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
          STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECTS(para).then(res => {
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
    // 获取创建人
    getBuyerList() {
      MERCHANT_API_DROPDOWN_USERLIST({
        UserState: SecurityUserState.Audit
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  created() {
    this.getBuyerList()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
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
</style>
