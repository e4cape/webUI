<template>
  <div>
    <el-form
      :model="queryForm"
      label-width="100px"
      ref="search"
      :inline="true"
      class="item-lh-26 p10"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="btnLinkEdit"
              type="primary"
              @click="$router.push({path: '/gift/supplier/supplierEdit'})"
            >新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select
              name="State"
              filterable
              v-model="queryForm.State"
              @change="onSearch"
            >
              <el-option
                label="所有状态"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in EnableState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SupplierCode">
            <el-input
              name="SupplierCode"
              v-model="queryForm.SupplierCode"
              placeholder="公司编码"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="地区："
            prop="Area"
          >
            <el-cascader
              filterable
              v-model="queryForm.Area"
              :options="$store.getters.areas"
              ref="cascader"
              placeholder="所有地区"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="公司编码："
            prop="SupplierCode"
          >
            <el-input
              name="SupplierCode"
              v-model="queryForm.SupplierCode"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="SupplierName"
          >
            <el-input
              name="SupplierName"
              v-model="queryForm.SupplierName"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="创建日期："
            prop="CreateTime"
          >
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              :unlink-panels="true"
              placeholder="选择日期范围"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="公司电话："
            prop="Phone"
          >
            <el-input
              name="Phone"
              v-model="queryForm.Phone"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人："
            prop="Contact"
          >
            <el-input
              name="Contact"
              v-model="queryForm.Contact"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人手机："
            prop="Mobile"
          >
            <el-input
              name="Mobile"
              v-model="queryForm.Mobile"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型/套餐"
            prop="PackId"
          >
            <el-select
              name="PackId"
              v-model="queryForm.PackId"
            >
              <el-option
                label="全部"
                value
              ></el-option>
              <el-option
                v-for="item in packages"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="SupplierCode"
        label="公司编码"
        min-width="100"
        sortable="custom"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        prop="SupplierName"
        label="公司名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="PackName"
        label="类型/套餐"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Taxes"
        label="提点比率"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{$root.toFloat(scope.row.Taxes * 100)}}%</template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column
        label="地区"
        min-width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.ProvinceName}} {{scope.row.CityName}} {{scope.row.TownName}}</template>
      </el-table-column>
      <el-table-column
        prop="Phone"
        label="公司电话"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Contact"
        label="联系人"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Mobile"
        label="联系人手机"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="状态"
        min-width="60"
        show-overflow-tooltip
        fixed="right"
      >
        <template slot-scope="scope">{{EnableState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            name="btnLinkCheck"
            :to="{path:'/gift/supplier/supplierCheck',query:{id:scope.row.SupplierId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnLinkEdit"
            :to="{path:'/gift/supplier/supplierEdit',query:{id:scope.row.SupplierId}}"
            class="btn-link el-button el-button--text"
          >修改</router-link>
          <el-button
            name="btnDiasbled"
            type="text"
            @click="diabledSupplier(scope.row.SupplierId)"
            v-if="scope.row.State == EnableState.Enable"
          >停用</el-button>
          <el-button
            name="btnEnable"
            type="text"
            @click="enableSupplier(scope.row.SupplierId)"
            v-if="scope.row.State == EnableState.Disable"
          >启用</el-button>
          <el-button
            name="btnReset"
            type="text"
            @click="restPassword(scope.row)"
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>

    <el-dialog
      title="重置供应商密码"
      width="500px"
      :visible.sync="passVisible"
      custom-class="department-dialog"
    >
      <el-form
        @submit.native.prevent
        label-width="110px"
        :model="passRow"
        ref="form"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              v-if="passRow.AdministratorId"
              label="管理员账号："
            >
              <span>{{passRow.AdministratorId}}</span>
            </el-form-item>
            <el-form-item
              label="新密码："
              prop="Department"
            >
              <input
                type="password"
                style="width: 0; height:0; display:none;"
                disabled
              >
              <el-input
                name="password"
                type="password"
                autocomplete="new-password"
                v-model="loginpass"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnSave"
          type="primary"
          :loading="$store.getters.is_loading"
          @click="insertPassport"
        >确 定</el-button>
        <el-button
          name="btnCancel"
          @click="passVisible =  false"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MERCHANT_API_SUPPLIER_BASIC_GETS, // 珠宝供应商服务 - 检索
  MERCHANT_API_SUPPLIER_BASIC_ENABLE, // 珠宝供应商服务 - 启用
  MERCHANT_API_SUPPLIER_BASIC_DISABLE, // 珠宝供应商服务 - 停用
  MERCHANT_API_DROPDOWN_PACKBASICLIST, //  套餐 - 列表(下拉)
  MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT // 用户账号服务 - 修改密码(平台)
} from '@/apis/merchant'

import { YNStatus, CharacterType, EnableState } from '@/enums/common'

import pagination from '@/components/pagination.vue'
import SearchPanel from '@/components/searchPanel.vue'
export default {
  data() {
    return {
      EnableState,
      queryForm: {
        SupplierCode: '',
        SupplierName: '',
        PackId: '',
        Area: ['', '', ''],
        Contact: '',
        Mobile: '',
        Phone: '',
        CreateTime: [],
        State: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      packages: [],
      passVisible: false,
      passRow: {},
      loginpass: ''
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/supplier/index',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.SupplierCode = query.SupplierCode || ''
      this.parameter.SupplierName = query.SupplierName || ''
      this.parameter.PackId = query.PackId || ''
      this.parameter.Area = query.Area || ['', '', '']
      this.parameter.Contact = query.Contact || ''
      this.parameter.Mobile = query.Mobile || ''
      this.parameter.Phone = query.Phone || ''
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.State = query.State > 0 ? query.State : 0
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    getData() {
      const { CreateTime, Area } = this.parameter
      let parameter = Object.assign(this.queryForm, this.parameter, {
        CreateTime1: CreateTime[0],
        CreateTime2: CreateTime[1],
        ProvinceId: +Area[0],
        CityId: +Area[1],
        TownId: +Area[2] || 0
      })
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SUPPLIER_BASIC_GETS(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'SupplierCode':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      if (!sort.order) {
        this.queryForm.IsAsced = YNStatus.No
      } else {
        this.queryForm.IsAsced =
          sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      }
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs.search.resetFields()
      this.queryForm.State = 0
      this.queryForm.Area = ['', '', '']
      this.queryForm.CreateTime = []
      this.queryForm.PackId = ''
      this.onSearch()
    },
    diabledSupplier(SupplierId) {
      this.$confirm('确定停用?', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MERCHANT_API_SUPPLIER_BASIC_DISABLE({
          SupplierId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已停用！')
            this.getData()
          }
        })
      })
    },
    enableSupplier(SupplierId) {
      this.$confirm('确定启用?', '启用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MERCHANT_API_SUPPLIER_BASIC_ENABLE({
          SupplierId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已启用！')
            this.getData()
          }
        })
      })
    },
    getPackages() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Supplier
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packages = res.data.Data.Rows
        }
      })
    },
    restPassword(row) {
      this.passRow = row
      this.passVisible = true
    },
    insertPassport() {
      if (this.loginpass.length < 5 || this.loginpass.length > 20) {
        this.$message.error('密码长度为5-20位字符')
        return
      }
      this.$confirm('是否重置供应商密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT({
            CharacterId: this.passRow.CharacterId,
            LoginId: this.passRow.AdministratorId,
            Loginpass2: this.loginpass
          }).then(res => {
            this.passVisible = false
            if (res.data.Code === 'CORRECT') {
              this.$message.success('重置成功')
              this.loginpass = ''
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.loginpass = ''
        })
    }
  },
  created() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
  },
  beforeMount() {
    this.getPackages()
    this.init()
  },
  mounted() {},
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    SearchPanel
  }
}
</script>
