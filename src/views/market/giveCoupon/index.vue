<template>
  <div class="content">
    <el-form
      :model="queryForm"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template
          slot="btnBox"
          v-if="!isOneNumberManyShopCompany"
        >
          <el-button
            name="btnCreateDialog"
            type="primary"
            @click="createDialog"
          >新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select
              name="dropdownMenuStatus"
              v-model="queryForm.status"
              placeholder="所有状态"
              @change="onStatusChange"
            >
              <el-option
                label="所有状态"
                value
              ></el-option>
              <el-option
                v-for="(item,index) in giveCouponStatus.Types"
                :key="index"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="giveId">
            <el-input
              name="inputGiveId"
              v-model="queryForm.giveId"
              placeholder="请输入单据编号"
              @keyup.enter.native="onSearch"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="单据编号："
            prop="giveId"
          >
            <el-input
              name="inputGiveIds"
              v-model="queryForm.giveId"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="创建人："
            prop="createUserId"
          >
            <el-select
              name="selectCreateUserId"
              v-model="queryForm.createUserId"
              placeholder="全部"
              :filterable="true"
            >
              <el-option
                label="全部"
                value
              ></el-option>
              <el-option
                v-for="(item, index) in $store.getters.users"
                :key="index"
                :label="item.TrueName"
                :value="String(item.UserId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            name="datePickerCreateTime"
            label="创建时间："
            prop="CreateTime"
          >
            <el-date-picker
              v-model="queryForm.CreateTime"
              :unlink-panels="true"
              type="daterange"
              format="yyyy-MM-dd"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="优惠券编号："
            prop="couponId"
          >
            <el-input
              name="inputCouponId"
              v-model="queryForm.couponId"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="优惠券名称："
            prop="couponName"
          >
            <el-input
              name="inputCouponName"
              @keyup.native.enter="onSearch"
              v-model="queryForm.couponName"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="datePickerLastTime"
            label="最后操作时间："
            prop="lastTime"
          >
            <el-date-picker
              v-model="queryForm.lastTime"
              type="daterange"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="门店"
            prop="characterId"
            v-if="isOneNumberManyShopCompany"
          >
            <el-select
              name="selectCharacterId"
              v-model="queryForm.characterId"
              placeholder="所有门店"
            >
              <el-option
                v-for="item in $store.getters.stores"
                :key="item.CharacterId"
                :label="item.Value"
                :value="parseInt(item.CharacterId)"
              ></el-option>
            </el-select>
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
      <el-table-column
        prop="giveId"
        label="单据编号"
        min-width="160"
        sortable="custom"
        show-overflow-tooltip
        fixed="left"
      ></el-table-column>
      <el-table-column
        prop="settingOptionName"
        label="赠送原因"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        v-if="isOneNumberManyShopCompany"
        prop="storeName"
        label="门店"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="110"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="couponId"
        label="优惠券编号"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <router-link :to="{path: '/market/coupon/couponbasic/' + scope.row.couponId}">
            <el-button
              name="btnCouponId"
              type="text"
            >{{scope.row.couponId}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponName"
        label="优惠券名称"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <router-link :to="{path: '/market/coupon/couponbasic/' + scope.row.couponId}">
            <el-button
              name="btnCouponName"
              type="text"
            >{{scope.row.couponName}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemAmt"
        label="赠送人数"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="lastTime"
        label="最后操作时间"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        sortable="custom"
        min-width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <template v-if="canShowTooltip(scope.row)">
            <el-tooltip
              class="item"
              :content="scope.row.checkNote"
              placement="top"
              effect="light"
            >
              <span class="red">{{scope.row.statusText}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="{red: needShowTooltip(scope.row)}">{{scope.row.statusText}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            name="linkCheck"
            :to="{path:'/market/giveCoupon/giveCouponCheck',query:{id:scope.row.giveId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <template v-if="!isOneNumberManyShopCompany">
            <template v-if="scope.row.status == giveCouponStatus.Draft || scope.row.status == giveCouponStatus.Returned">
              <router-link
                name="linkEdit"
                :to="{path:'/market/giveCoupon/giveCouponEdit',query:{id:scope.row.giveId}}"
                class="btn-link el-button el-button--text"
              >编辑</router-link>
            </template>
            <el-button
              name="linkAudit"
              type="text"
              @click="auditgiveCoupon(scope.row)"
              v-if="scope.row.status == giveCouponStatus.Pending"
            >审核</el-button>
            <el-button
              name="linkInvalid"
              type="text"
              @click="giveCouponInvalid(scope.row.giveId)"
              v-if="scope.row.status == giveCouponStatus.Draft || scope.row.status == giveCouponStatus.Returned"
            >作废</el-button>
          </template>
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

    <!-- @module Dialog·新建 -->
    <giveCoupon-create
      title="新建"
      v-if="beforeCreateDialog"
      :beforeCreateDialog="beforeCreateDialog"
      @listenCreateDialog="listenCreateDialog"
    ></giveCoupon-create>
    <!-- End Dialog·新建 -->

    <!-- @module Dialog·修改退货单基本信息-->
    <basic-edit
      title="选择赠送优惠券原因"
      v-if="editDialog"
      :editDialog="editDialog"
      :editForm="editForm"
      :isCreate="true"
      :couponCreateRow="couponCreateRow"
      @listenEditDialog="listenEditDialog"
    ></basic-edit>
    <!-- End Dialog·修改退货单基本信息 -->

    <!-- @module Dialog·审核 -->
    <giveCoupon-audit
      title="审核"
      :data="selection"
      :visible.sync="auditDialog"
      @success="listenAuditDialog"
    ></giveCoupon-audit>
    <!-- End Dialog·审核 -->
  </div>
</template>

<script>
import { SecurityUserState } from '@/enums/merchant.js'
import { CharacterType, YNStatus, EnableState } from '@/enums/common'
import { FinanceType } from '@/enums/stocking'
import { GiveCouponStatus } from '@/enums/membership.js'
import {
  MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPONLIST,
  MEMBERSHIP_API_GIVECOUPON_CREATE,
  MEMBERSHIP_API_GIVECOUPON_INVALID
} from '@/apis/membership.js'

import searchPanel from '@/components/searchPanel.vue'
import giveCouponAudit from './giveCouponAudit'
import giveCouponCreate from './giveCouponCreate'
import basicEdit from './giveCouponBasicEdit'
import pagination from '@/components/pagination'

export default {
  data() {
    // 一号多店的总部
    return {
      giveCouponStatus: GiveCouponStatus,
      YNStatus,
      financeTypes: FinanceType,
      enableStates: EnableState,
      securityUserStates: SecurityUserState,
      characterTypes: CharacterType,
      queryForm: {
        // 查询表单数据
        settingOptionId: '',
        status: '',
        giveId: '',
        createUserId: '',
        createTimeStart: '',
        createTimeEnd: '',
        couponId: '',
        couponName: '',
        lastTimeStart: '',
        lastTimeEnd: '',
        characterId: '',
        orderField: '',
        orderType: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        lastTime: '',
        CreateTime: ''
      },
      parameters: {},
      data: [],
      total: 0,
      editDialog: false,
      reasonDialog: false,
      couponCreateRow: {},
      selection: [], // 选中的数据
      auditDialog: false,
      beforeCreateDialog: false,
      beforeCreateForm: {
        SupplierId: '',
        giveCouponUserId: '',
        TargetCharacterId: '',
        FinanceType: FinanceType.Self,
        ArrivalCode: '',
        Note: ''
      },
      editForm: {
        settingOptionId: '',
        Note: ''
      },
      abandonDialog: false, // 作废对话框
      abandongiveCoupon: {}, // 作废采购单
      cancelDialog: false // 取消审核对话框
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(this.queryForm, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.queryForm.CreateTime || ['', '']
      let lastTime = this.queryForm.lastTime || ['', '']
      let param = {
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        lastTimeStart: lastTime[0],
        lastTimeEnd: lastTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPONLIST(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selection = selection
    },
    getUserList() {
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    selectState(value) {
      this.queryForm.status = GiveCouponStatus.Types[value]
        ? GiveCouponStatus.Types[value].key
        : ''
      this.onSearch()
    },
    creategiveCoupon() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MEMBERSHIP_API_GIVECOUPON_CREATE({
            ArrivalCode: this.beforeCreateForm.ArrivalCode,
            FinanceType: this.beforeCreateForm.FinanceType,
            SupplierId: this.beforeCreateForm.SupplierId,
            TargetCharacterId: this.beforeCreateForm.TargetCharacterId,
            StoreName: this.getStoreName(
              this.beforeCreateForm.TargetCharacterId
            ),
            SupplierName: this.getSupplierName(
              this.beforeCreateForm.SupplierId
            ),
            giveCouponUserId: this.beforeCreateForm.giveCouponUserId,
            giveCouponUser: this.getUserListName(
              this.beforeCreateForm.giveCouponUserId
            ),
            Note: this.beforeCreateForm.Note
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.$refs['createForm'].resetFields()
              this.beforeCreateDialog = false
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/stock/giveCoupon/giveCouponEdit',
                query: {
                  id: res.data.Data.giveId
                }
              })
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getStoreName(CharacterId) {
      let name = ''
      this.$store.getters.stores.forEach(item => {
        if (item.CharacterId === parseInt(CharacterId)) {
          name = item.Value
          return false
        }
      })
      return name
    },
    getUserListName(userid) {
      let name = ''
      this.$store.getters.users.forEach(item => {
        if (item.UserId === parseInt(userid)) {
          name = item.TrueName
          return false
        }
      })
      return name
    },
    getSupplierName(supplierId) {
      let name = ''
      this.$store.getters.suppliers.forEach(item => {
        if (item.SupplierId === parseInt(supplierId)) {
          name = item.SupplierName
          return false
        }
      })
      return name
    },
    auditgiveCoupon(row) {
      this.selection = row
      this.auditDialog = true
    },
    listenAuditDialog() {
      this.selection = []
      this.getData()
    },
    giveCouponInvalid(id) {
      this.$confirm('确定作废此赠送券？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(11)
          MEMBERSHIP_API_GIVECOUPON_INVALID({
            giveId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('作废成功')
              this.init()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    listenCancelDialog(success) {
      if (success) {
        this.getData()
      }
      this.cancelDialog = false
    },
    listenDictDialog() {
      this.reasonDialog = false
    },
    listenDictSave() {},
    resetForm() {
      this.beforeCreateForm = {
        SupplierId: '',
        giveCouponUserId: this.$store.getters.user_session.UserId,
        FinanceType: this.financeTypes.Self,
        ArrivalCode: '',
        Note: ''
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onStatusChange() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
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
    },
    getStores() {
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    listenCreateDialog(obj) {
      this.beforeCreateDialog = false
      if (obj) {
        this.editDialog = true
        this.couponCreateRow = obj
      }
    },
    listenEditDialog() {
      this.editDialog = false
    },
    createDialog() {
      this.beforeCreateDialog = true
      this.couponCreateRow = {}
    },
    canShowTooltip(data) {
      const statusMatch = this.needShowTooltip(data)
      const { checkNote } = data
      return statusMatch && !!checkNote
    },
    needShowTooltip(data) {
      const { status } = data
      const s = String(status)
      return s === GiveCouponStatus.Returned || s === GiveCouponStatus.Invalid
    }
  },
  filters: {
    statusChange(value) {
      let result = ''
      GiveCouponStatus.Types.forEach(item => {
        if (item.key == value) {
          result = item.title
        }
      })
      return result || '所有状态'
    },
    handleCommand() {
      if (!this.ss.length) {
        return this.$message.warning('请选择要批量操作的单据.')
      }
      this.singleCheck = false
      this.cOpen = true
    }
  },
  beforeMount() {
    this.getStores()
    this.beforeCreateForm.giveCouponUserId = this.$store.getters.user_session.UserId // 设置默认采购员
  },
  mounted() {
    this.getUserList()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    '$store.getters.user_session.UserId'() {
      this.beforeCreateForm.giveCouponUserId = this.$store.getters.user_session.UserId // 设置默认采购员
    }
  },
  components: {
    pagination,
    basicEdit,
    searchPanel,
    giveCouponAudit,
    giveCouponCreate
  }
}
</script>
