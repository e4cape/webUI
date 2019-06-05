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
              placeholder="供应商名称"
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
            prop="PartnerCode"
            label="供应商编码："
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
            label="供应商名称："
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
        label="供应商名称"
        min-width="100"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        prop="PartnerCode"
        label="供应商编码"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
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
        <template slot-scope="scope">{{$root.toFloat(scope.row.Taxes * 100) + '%'}}</template>
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
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="supplierCheck(scope.row.PartnerId)"
            name="btnCheck"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="supplierEdit(scope.row.PartnerId)"
            name="btnEdit"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.State === YNStatus.Yes"
            @click="supplierOff($event,scope.row.PartnerId)"
            name="btnSupplierOff"
          >停用</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.State === YNStatus.No"
            @click="supplierOn($event,scope.row.PartnerId)"
            name="btnSupplierOn"
          >启用</el-button>
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
    <!-- 新建供应商 -->
    <template v-if="dialogCreateVisible">
      <supplier-create
        :dialogCreateVisible="dialogCreateVisible"
        @listenCreateVisible="listenCreateVisible"
      ></supplier-create>
    </template>
    <!-- End 新建供应商 -->
    <!-- 修改供应商 -->
    <template v-if="dialogEditVisible">
      <supplier-edit
        :partnerId="partnerId"
        :dialogEditVisible="dialogEditVisible"
        @listenEditVisible="listenEditVisible"
      ></supplier-edit>
    </template>
    <!-- End 查看供应商 -->
    <!-- 查看供应商 -->
    <template v-if="dialogCheckVisible">
      <supplier-check
        :partnerId="partnerId"
        :dialogCheckVisible="dialogCheckVisible"
        @listenCheckVisible="listenCheckVisible"
      ></supplier-check>
    </template>
    <!-- End 查看供应商 -->
  </div>
</template>

<script>
import { EnableState, YNStatus, PartnerType } from '@/enums/common.js'
import { PartnerBasicSettleType } from '@/enums/stocking.js'
import {
  STOCKING_API_PARTNER_BASIC_GETS,
  STOCKING_API_PARTNER_BASIC_ENABLE,
  STOCKING_API_PARTNER_BASIC_DISABLE
} from '@/apis/stocking.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import supplierCreate from './supplierCreate'
import supplierEdit from './supplierEdit'
import supplierCheck from './supplierCheck'

export default {
  data() {
    return {
      YNStatus,
      enableStates: EnableState,
      queryForm: {
        PartnerType: PartnerType.Supplier, // int32	往来单位类型(枚举)	required,gte=0
        PartnerCode: '', //	string	往来单位编码	required
        PartnerName: '', //	string	往来单位名称	required
        ShortName: '', //	string	往来单位简称	max=50
        SettleType: PartnerBasicSettleType.Should, //	int32	结算方式(枚举)	gte=0
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
      data: [],
      total: 0,
      partnerId: 0,
      dialogCreateVisible: false, // 新建供应商弹窗
      dialogEditVisible: false, // 新建供应商弹窗
      dialogCheckVisible: false, // 查看供应商弹窗
      parameters: {}
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            PartnerType: PartnerType.Supplier, // int32	往来单位类型(枚举)	required,gte=0
            PartnerCode: '', //	string	往来单位编码	required
            PartnerName: '', //	string	往来单位名称	required
            ShortName: '', //	string	往来单位简称	max=50
            SettleType: 0, //	int32	结算方式(枚举)	gte=0
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
      // 获取供应商列表数据
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
    supplierCreate,
    supplierEdit,
    supplierCheck
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

