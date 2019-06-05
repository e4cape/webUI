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
        <template slot="btnBox">
          <el-button
            type="primary"
            @click="dialogCreateVisible = true"
            name="btnCreate"
          >新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select
              filterable
              v-model="queryForm.State"
              placeholder="所有状态"
              name="state"
            >
              <el-option
                label="所有状态"
                value="0"
              ></el-option>
              <el-option
                v-for="(item,index) in enableStates.Types"
                :key="index"
                :label="item"
                :value="String(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PartnerName">
            <el-input
              v-model="queryForm.PartnerName"
              placeholder="来往单位名称"
              @keyup.enter.native="onSearch"
              name="PartnerName"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
                name="btnSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            prop="PartnerType"
            label="所有类型："
          >
            <el-select
              filterable
              v-model="queryForm.PartnerType"
              placeholder="所有类型"
              name="PartnerType"
            >
              <el-option
                label="所有类型"
                value="0"
              ></el-option>
              <el-option
                v-for="(item,index) in partnerType.Types"
                :key="index"
                :label="item"
                :value="String(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="PartnerCode"
            label="单位编码："
          >
            <el-input
              v-model="queryForm.PartnerCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              name="PartnerCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="PartnerName"
            label="单位名称："
          >
            <el-input
              v-model="queryForm.PartnerName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              name="PartnerName"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="CreateTime"
            label="创建时间："
          >
            <el-date-picker
              v-model="queryForm.CreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :unlink-panels="true"
              type="daterange"
              :picker-options="$root.datePickerOptions"
              name="createTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            prop="SettleType"
            label="结算方式："
          >
            <el-select
              filterable
              v-model="queryForm.SettleType"
              placeholder="结算方式"
              name="state"
            >
              <el-option
                label="所有方式"
                value="0"
              ></el-option>
              <el-option
                v-for="(item,index) in partnerBasicSettleType.Types"
                :key="index"
                :label="item"
                :value="String(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="AreaData"
            label="所在地区："
          >
            <el-cascader
              filterable
              :options="$store.getters.areas"
              v-model="queryForm.AreaData"
              change-on-select
              name="areaData"
            ></el-cascader>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- Data Table -->
    <el-table
      :data="data"
      @sort-change="sortChange"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="PartnerName"
        label="单位名称"
        min-width="100"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        prop="PartnerCode"
        label="单位编码"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="PartnerType"
        label="单位类型"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{partnerType.Types[scope.row.PartnerType]}}</template>
      </el-table-column>
      <el-table-column
        prop="SettleType"
        label="结算方式"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{partnerBasicSettleType.Types[scope.row.SettleType]}}</template>
      </el-table-column>
      <el-table-column
        prop="TotalCash"
        label="账户余额(元)"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{$root.toFloat(scope.row.TotalCash)}}</template>
      </el-table-column>
      <el-table-column
        prop="ValidCash"
        label="可用余额(元)"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{$root.toFloat(scope.row.ValidCash)}}</template>
      </el-table-column>
      <el-table-column
        prop="LockCash"
        label="锁定余额(元)"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{$root.toFloat(scope.row.LockCash)}}</template>
      </el-table-column>
      <el-table-column
        prop="areas"
        label="所在地区"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ (scope.row.ProvinceName ? scope.row.ProvinceName : '') + (scope.row.CityName ? '/' + scope.row.CityName : '') + (scope.row.TownName ? '/' + scope.row.TownName : '') }}</template>
      </el-table-column>
      <el-table-column
        prop="Taxes"
        label="税率"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{$root.toFloat(scope.row.Taxes * 100)+ '%'}}</template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column
        prop="Status"
        label="状态"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{enableStates.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="supplierCheck(scope.row.PartnerId)"
            name="btnCheck"
          >查看</el-button>
          <el-button
            type="text"
            @click="supplierEdit(scope.row.PartnerId)"
            name="btnEdit"
          >修改</el-button>
          <el-button
            type="text"
            v-if="scope.row.State === YNStatus.Yes"
            @click="supplierOff($event,scope.row.PartnerId)"
            name="btnSupplierOff"
          >停用</el-button>
          <el-button
            type="text"
            v-if="scope.row.State === YNStatus.No"
            @click="supplierOn($event,scope.row.PartnerId)"
            name="btnSupplierOn"
          >启用</el-button>
          <el-button
            type="text"
            @click="recharge(scope.row.PartnerId)"
            name="recharge"
          >代充值</el-button>
          <el-button
            type="text"
            @click="getMoney(scope.row.PartnerId)"
            name="getMoney"
          >提现</el-button>
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
    <!-- End Panel -->
    <!-- 新建来往单位 -->
    <template v-if="dialogCreateVisible">
      <partner-create
        :dialogCreateVisible="dialogCreateVisible"
        @listenCreateVisible="listenCreateVisible"
      ></partner-create>
    </template>
    <!-- End 新建来往单位 -->
    <!-- 修改来往单位 -->
    <template v-if="dialogEditVisible">
      <partner-edit
        :partnerId="partnerId"
        :dialogEditVisible="dialogEditVisible"
        @listenEditVisible="listenEditVisible"
      ></partner-edit>
    </template>
    <!-- End 查看来往单位 -->
    <!-- 查看来往单位 -->
    <template v-if="dialogCheckVisible">
      <partner-check
        :partnerId="partnerId"
        :dialogCheckVisible="dialogCheckVisible"
        @listenCheckVisible="listenCheckVisible"
      ></partner-check>
    </template>
    <!-- End 查看来往单位 -->

    <el-dialog
      title="代充值"
      width="30%"
      :visible.sync="rechargeVisible"
      @close="resetPrice"
    >
      <el-form
        :model="rechargeForm"
        label-width="110px"
      >
        <el-form-item
          label="代充值金额："
          prop="Cash"
        >
          <el-input
            v-model="rechargeForm.Cash"
            :maxlength="9"
            @keyup.native="rechargeForm.Cash = $root.toFixed(rechargeForm.Cash, 2)"
            name="Cash"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="Note"
        >
          <el-input
            v-model="rechargeForm.Note"
            type="textarea"
            :maxlength="200"
            name="Note"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="$store.getters.is_loading"
          @click="createRechargeSubmit()"
          name="createRechargeSubmit"
        >确 定</el-button>
        <el-button
          @click="resetPrice"
          name="btnCancel"
        >取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提现"
      width="30%"
      :visible.sync="getMoneyVisible"
      custom-class="supplier-dialog"
      @close="resetPrice"
    >
      <el-form
        :model="getMoneyForm"
        label-width="110px"
      >
        <el-form-item
          label="提现金额："
          prop="Cash"
        >
          <el-input
            v-model="getMoneyForm.Cash"
            :maxlength="9"
            @keyup.native="getMoneyForm.Cash = $root.toFixed(getMoneyForm.Cash, 2)"
            name="Cash"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="Note"
        >
          <el-input
            v-model="getMoneyForm.Note"
            type="textarea"
            :maxlength="200"
            name="Note"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="$store.getters.is_loading"
          @click="createGetMoneySubmit()"
          name="createGetMoneySubmit"
        >确 定</el-button>
        <el-button
          @click="resetPrice"
          name="btnCancel"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { EnableState, YNStatus, PartnerType } from '@/enums/common.js'
import { PartnerBasicSettleType } from '@/enums/stocking.js'
import {
  STOCKING_API_PARTNER_BASIC_GETS,
  STOCKING_API_PARTNER_BASIC_ENABLE,
  STOCKING_API_PARTNER_BASIC_DISABLE,
  STOCKING_API_PARTNER_BALANCE_RECHARGE,
  STOCKING_API_PARTNER_BALANCE_CASH
} from '@/apis/stocking.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import partnerCreate from './partnerCreate'
import partnerEdit from './partnerEdit'
import partnerCheck from './partnerCheck'

export default {
  data() {
    return {
      YNStatus,
      enableStates: EnableState,
      partnerType: PartnerType,
      partnerBasicSettleType: PartnerBasicSettleType,
      queryForm: {
        PartnerType: '0', // int32	往来单位类型(枚举)	required,gte=0
        PartnerCode: '', //	string	往来单位编码	required
        PartnerName: '', //	string	往来单位名称	required
        ShortName: '', //	string	往来单位简称	max=50
        SettleType: '0', //	int32	结算方式(枚举)	gte=0
        State: '0',
        CreateTime: [],
        AreaData: [''], // 选中的地区
        ProvinceId: '',
        CityId: '',
        TownId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      rechargeForm: {
        PartnerId: '', //	int64	来往单位序号	required,gt=0
        Cash: '', //		float32	充值总额(元)	required,gt=0
        Note: '' //		string	简介(备注)	max=200
      },
      getMoneyForm: {
        PartnerId: '', //	int64	来往单位序号	required,gt=0
        Cash: '', //		float32	充值总额(元)	required,gt=0
        Note: '' //		string	简介(备注)	max=200
      },
      data: [],
      total: 0,
      partnerId: 0,
      dialogCreateVisible: false, // 新建来往单位弹窗
      dialogEditVisible: false, // 新建来往单位弹窗
      dialogCheckVisible: false, // 查看来往单位弹窗
      rechargeVisible: false,
      getMoneyVisible: false,
      parameters: {}
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            PartnerType: '0', // int32	往来单位类型(枚举)	required,gte=0
            PartnerCode: '', //	string	往来单位编码	required
            PartnerName: '', //	string	往来单位名称	required
            ShortName: '', //	string	往来单位简称	max=50
            SettleType: '0', //	int32	结算方式(枚举)	gte=0
            State: '0',
            CreateTime: [],
            AreaData: [''], // 选中的地区
            ProvinceId: '',
            CityId: '',
            TownId: '',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query, {
        AreaData: query.AreaData || ['']
      })
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getData() {
      // 获取来往单位列表数据
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['1900-01-01 0:00:00', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        ProvinceId: this.queryForm.AreaData[0],
        CityId: this.queryForm.AreaData[1],
        TownId: this.queryForm.AreaData[2]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_PARTNER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'PartnerCode':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    supplierOff(e, id) {
      e.currentTarget.blur()
      // 停用
      this.$confirm('是否停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_PARTNER_BASIC_DISABLE({
            PartnerId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    supplierOn(e, id) {
      e.currentTarget.blur()
      // 启用
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_PARTNER_BASIC_ENABLE({
            PartnerId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    resetPrice() {
      this.rechargeVisible = false
      this.getMoneyVisible = false
      this.rechargeForm = {
        PartnerId: '', //	int64	来往单位序号	required,gt=0
        Cash: '', //		float32	充值总额(元)	required,gt=0
        Note: '' //		string	简介(备注)	max=200
      }
      this.getMoneyForm = {
        PartnerId: '', //	int64	来往单位序号	required,gt=0
        Cash: '', //		float32	充值总额(元)	required,gt=0
        Note: '' //		string	简介(备注)	max=200
      }
    },
    createRechargeSubmit() {
      if (!this.rechargeForm.Cash) {
        this.$message({
          message: '请输入充值金额!',
          type: 'error'
        })
        return
      }
      STOCKING_API_PARTNER_BALANCE_RECHARGE({
        PartnerId: this.partnerId, //	int64	来往单位序号	required,gt=0
        Cash: this.$root.toInt(this.rechargeForm.Cash), //		float32	充值总额(元)	required,gt=0
        Note: this.rechargeForm.Note //		string	简介(备注)	max=200
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '充值成功',
            type: 'success'
          })
          this.getData()
        } else {
          this.$message({
            message: res.data.Message,
            type: 'error'
          })
        }
        this.resetPrice()
      })
    },
    createGetMoneySubmit() {
      if (!this.getMoneyForm.Cash) {
        this.$message({
          message: '请输入提现金额!',
          type: 'error'
        })
        return
      }
      STOCKING_API_PARTNER_BALANCE_CASH({
        PartnerId: this.partnerId, //	int64	来往单位序号	required,gt=0
        Cash: this.$root.toInt(this.getMoneyForm.Cash), //		float32	充值总额(元)	required,gt=0
        Note: this.getMoneyForm.Note //		string	简介(备注)	max=200
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提现成功',
            type: 'success'
          })
          this.getData()
        } else {
          this.$message({
            message: res.data.Message,
            type: 'error'
          })
        }
        this.resetPrice()
      })
    },
    listenCreateVisible(flag) {
      if (flag) {
        this.getData()
      }
      this.dialogCreateVisible = false
    },
    listenEditVisible(flag) {
      if (flag) {
        this.getData()
      }
      this.dialogEditVisible = false
    },
    supplierEdit(id) {
      this.dialogEditVisible = true
      this.partnerId = id
    },
    listenCheckVisible(flag) {
      this.dialogCheckVisible = flag
    },
    supplierCheck(id) {
      this.partnerId = id
      this.dialogCheckVisible = true
    },
    recharge(id) {
      this.partnerId = id
      this.rechargeVisible = true
    },
    getMoney(id) {
      this.partnerId = id
      this.getMoneyVisible = true
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
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    getAreaData() {
      this.$store.dispatch('GET_AREAS_DROPLIST')
    }
  },
  created() {
    this.getAreaData()
  },
  beforeMount() {
    this.IsAsced = this.YNStatus.No
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    pagination,
    searchPanel,
    partnerCreate,
    partnerEdit,
    partnerCheck
  }
}
</script>
<style lang="scss">
.supplier-dialog {
  width: 800px;
}
</style>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>

