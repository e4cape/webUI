<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      @keyup.enter.native="onSearch"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="equipmentCreate"
              type="primary"
              @click="$router.push('/setter/authorizationManage/equipmentcreate')"
            >新增</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select
              name="Status"
              @change="onSearch"
              v-model="form.Status"
            >
              <el-option
                label="所有状态"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in cashierStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              name="EquipmentIdSearchBar"
              v-model="form.EquipmentId"
              placeholder="授权设备号"
            >
              <el-button
                name="search"
                @click="onSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template
          slot="seniorSearch"
          prop="EquipmentId"
        >
          <el-form-item
            label="授权设备号："
            prop="EquipmentId"
          >
            <el-input
              name="EquipmentId"
              v-model="form.EquipmentId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="授权角色序号："
            prop="CharacterId"
          >
            <el-input
              name="CharacterId"
              v-model="form.CharacterId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreTitle"
          >
            <el-input
              name="StoreTitle"
              v-model="form.StoreTitle"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店编码："
            prop="StoreCode"
          >
            <el-input
              name="StoreCode"
              v-model="form.StoreCode"
            ></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="授权设备序号"
        prop="EquipmentId"
        min-width="150"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        label="门店编码"
        prop="StoreCode"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="授权角色序号"
        prop="CharacterId"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="StoreTitle"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">
          <el-tooltip
            :content="scoped.row.StoreTitle"
            placement="bottom"
          >
            <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scoped.row.StoreTitle}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="授权时间"
        min-width="100"
        prop="LastTime"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">{{scoped.row.LastTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="Status"
        min-width="50"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{CashierEquipmentStatus.Types[scope.row.Status]}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            name="detail"
            type="text"
            @click="detail(scope.row.EquipmentId)"
          >详情</el-button>
          <el-button
            name="unAuth"
            v-if="scope.row.Status == 5"
            type="text"
            @click="unAuth($event,scope.row.EquipmentId)"
          >取消认证</el-button>
          <el-button
            name="abandon"
            v-if="scope.row.Status == 3"
            type="text"
            @click="abandon(scope.row.EquipmentId)"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import {
  MARKETING_API_CASHIER_EQUIPMENT_GETS, // 收银台授权(列表)
  MARKETING_API_CASHIER_EQUIPMENT_UNAUTH, // 设备服务 - 取消认证
  MARKETING_API_CASHIER_EQUIPMENT_ABANDON // 设备服务 - 作废(主键行锁)
} from '@/apis/marketing.js'

import { YNStatus } from '@/enums/common.js'
import { CashierEquipmentStatus } from '@/enums/marketing.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      YNStatus,
      // cashierStatusList: CashierEquipmentStatus.Types,
      cashierStatusList: [],
      CashierEquipmentStatus,
      form: {
        EquipmentId: '',
        StoreTitle: '',
        StoreCode: '',
        Status: 0,
        CharacterId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  mounted() {
    this.init()
    this.getEnums()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    getEnums() {
      for (let m in CashierEquipmentStatus.Types) {
        this.cashierStatusList.push({
          value: parseInt(m),
          label: CashierEquipmentStatus.Types[m]
        })
      }
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/authorizationManage/index',
        query: this.parameter
      })
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.form.Status = 0
      this.onSearch()
    },
    init() {
      // 根据路由参数重置查询条件
      let query = this.$route.query
      this.parameter.CharacterId = query.CharacterId || ''
      this.parameter.EquipmentId = query.EquipmentId || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.StoreCode = query.StoreCode || ''
      this.parameter.Status = parseInt(query.Status) || 0
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MARKETING_API_CASHIER_EQUIPMENT_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    detail(id) {
      this.$router.push(`/setter/authorizationManage/equipmentdetail?id=${id}`)
    },
    unAuth(e, id) {
      e.currentTarget.blur()
      this.$confirm('取消认证影响使用，确定要取消认证吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_CASHIER_EQUIPMENT_UNAUTH({
            EquipmentId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    abandon(id) {
      this.$prompt('请输入作废原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /^(.|\n|\r){1,200}$/,
        inputErrorMessage: '请正确输入作废原因！'
      })
        .then(({ value }) => {
          MARKETING_API_CASHIER_EQUIPMENT_ABANDON({
            EquipmentId: id,
            checkNote: value
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    sizeChange(val) {
      this.parameter.PageSize = parseInt(val)
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(val) {
      this.parameter.PageIndex = parseInt(val)
      this.initRoute()
    }
  }
}
</script>