<template>
  <el-row class="content">
    <el-form :model="queryForm" @keyup.enter.native="onSearch" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialogVisible = true" name="btnCreate">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in HalfCountOrderBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" placeholder="单据编号" name="CountCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="盘点位置：" prop="WarehouseId">
            <el-select v-model="queryForm.WarehouseId" :filterable="true" name="WarehouseId">
              <el-option label="所有位置" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" name="CountCode"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select v-model="queryForm.CreateUserId" :filterable="true" name="CreateUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- Data Table -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CountCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName" label="盘点仓库" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PositionNote" label="盘点货架" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="HalfClassDvs" label="盘点范围" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" :formatter="formatter" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="结束时间" min-width="120" :formatter="formatter" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="应盘">
        <el-table-column prop="Quantity1" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight1" label="重量" :formatter="formatter"  min-width="90" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <el-table-column label="盘亏">
        <el-table-column prop="Quantity3" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight3" label="重量" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <el-table-column label="盘盈">
        <el-table-column prop="Quantity4" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight4" label="重量" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="Quantity3" label="盘亏数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity4" label="盘盈数量" min-width="100" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span :class="scope.row.State | findKey(HalfCountOrderBasicState)">{{HalfCountOrderBasicState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/semitaking/check',query:{id:scope.row.CountId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State === HalfCountOrderBasicState.Taking">
            <router-link :to="{path:'/depot/semitaking/edit',query:{id:scope.row.CountId}}" class="btn-link el-button el-button--text">继续盘点</router-link>
            <el-button type="text" @click="cancelTaking($event, scope.row.CountId)">取消盘点</el-button>
          </template>
          <el-button v-if="scope.row.State === HalfCountOrderBasicState.Finish" type="text" @click="showTakingLogs(scope.row.CountId)">盘点报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建柜台 -->
    <el-dialog title="新建盘点单" :visible.sync="createDialogVisible" class="taking-create-dialog" @close="resetCreateForm" width="600px">
      <el-form :model="createForm" label-position="right" label-width="60px" :rules="createRules" ref="createForm">
        <el-row class="m-b-10">
          <b>请选择盘点位置：</b>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仓库：" prop="WarehouseId">
              <el-select v-model="createForm.WarehouseId" @change="getShelfList" :filterable="true" name="WarehouseId">
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="货架：" prop="ShelfIds">
              <el-checkbox-group v-model="createForm.ShelfIds" @change="getPositionNote">
                <el-checkbox v-for="(item, index) in shelfList" :key="index" :label="item.Id">{{item.Value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="m-b-10">
          <b>请选择盘点范围：</b>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分类：" prop="HalfClassDks">
              <el-select v-model="createForm.HalfClassDks" @change="getHalfClassDvs" placeholder="全部" multiple name="HalfClassDks" clearable class="half-class">
                <el-option v-for="(item, index) in halfClassList" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer tc">
        <el-button type="primary" @click="takingCreate" :loading="$store.getters.is_loading" name="btnTakingCreate">确 定</el-button>
        <el-button @click="createDialogVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建柜台 -->

    <!-- @module 盘点报告 -->
    <taking-log :visible.sync="takingLogVisible" :countId="countId"></taking-log>
    <!-- End 盘点报告 -->
  </el-row>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import {
  HalfCountOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import {
  STOCKING_API_HALF_COUNT_ORDER_BASIC_GETS,
  STOCKING_API_HALF_COUNT_ORDER_BASIC_CREATE,
  STOCKING_API_HALF_COUNT_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import takingLog from './takingLog'

export default {
  data() {
    return {
      YNStatus,
      HalfCountOrderBasicState,
      queryForm: {
        // 查询表单数据
        WarehouseId: '0',
        CreateUserId: '0',
        State: '0',
        OrderBy: '1',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: [],
        CountCode: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: ''
      },
      parameters: {},
      data: [],
      total: 0,
      createDialogVisible: false, // 新建盘点单
      takingLogVisible: false, // 盘点报告弹窗
      countId: '',
      createForm: {
        WarehouseId: '',
        HalfClassDks: [],
        HalfClassDvs: ['全部'],
        ShelfIds: [],
        PositionNote: '',
      },
      createRules: {
        WarehouseId: [{ required: true, message: '请选择盘点位置' }],
        ShelfIds: [{ required: true, message: '请选择盘点位置' }]
      },
      halfClassList: [],
      shelfList: []
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'CheckTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'State':
          return HalfCountOrderBasicState.Types[val]
        default:
          return this.$root.toFloat(val, 3) + 'g'
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            // 查询表单数据
            WarehouseId: '0',
            CreateUserId: '0',
            State: '0',
            OrderBy: '1',
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            CreateTime: [],
            CheckTime: [],
            CountCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: ''
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = { ...query }
      this.queryForm = { ...query }
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_HALF_COUNT_ORDER_BASIC_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (this.queryForm.CreateTime.length > 0) {
        this.queryForm.CreateTime1 = this.queryForm.CreateTime[0]
        this.queryForm.CreateTime2 = this.queryForm.CreateTime[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      if (this.queryForm.CheckTime.length > 0) {
        this.queryForm.CheckTime1 = this.queryForm.CheckTime[0]
        this.queryForm.CheckTime2 = this.queryForm.CheckTime[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      this.queryForm.isSenior = true
      if (JSON.stringify(this.queryForm) == JSON.stringify(this.parameters)) {
        this.getData()
      } else {
        this.parameters = {...this.queryForm}
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      this.onSearch()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CountCode':
          this.parameters.OrderBy = 0
          break
        case 'CheckTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
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
    getShelfList(val) {
      this.shelfList = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.createForm.ShelfIds = this.shelfList.map(item => item.Id)
      this.createForm.PositionNote = this.shelfList.map(item => item.Value).join(',')
    },
    getHalfClassDvs(val) {
      this.createForm.HalfClassDvs = []
      if (val) {
        this.halfClassList.forEach(item => {
          if (val.some(id => id === item.Id)) {
            this.createForm.HalfClassDvs.push(item.Value)
          }
        })
      } else {
        this.createForm.HalfClassDvs = ['全部']
      }
    },
    getPositionNote(val) { // 获取货架名称
      let arr = []
      this.shelfList.forEach(item => {
        if (val.some(id => id === item.Id)) {
          arr.push(item.Value)
        }
      })
      this.createForm.PositionNote = arr.join(',')
    },
    takingCreate() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let halfClassDks = []
          let halfClassDvs = []
          if ( this.createForm.HalfClassDks.length === 0) {
            
            this.halfClassList.forEach(item => {
              halfClassDks.push(item.Id) 
              halfClassDvs.push(item.Value)
            })
          } else {
            halfClassDks = this.createForm.HalfClassDks
            halfClassDvs = this.createForm.HalfClassDvs
          }
          STOCKING_API_HALF_COUNT_ORDER_BASIC_CREATE({
            WarehouseId: this.createForm.WarehouseId,
            HalfClassDks: halfClassDks.join(','),
            HalfClassDvs: halfClassDvs.join(','),
            ShelfIds: this.createForm.ShelfIds,
            PositionNote: this.createForm.PositionNote
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.createDialogVisible = false
              this.$router.push({
                path: '/depot/semitaking/edit',
                query: {
                  id: res.data.Data
                }
              })
            }
          })
        }
      })
    },
    resetCreateForm() {
      this.$refs.createForm.resetFields()
      this.createForm.HalfClassDvs = []
      this.createForm.ShelfIds = []
      this.shelfList = []
      this.createForm.PositionNote = ''
    },

    showTakingLogs(id) {
      this.countId = id
      this.takingLogVisible = true
    },
    cancelTaking($event, id) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_HALF_COUNT_ORDER_BASIC_CANCEL({
            CountId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()             
            }
          })
        })
        .catch(() => { })
    },
    getEnums() {
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST',  {HasShelf: YNStatus.Yes, State: YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfBasicHalfClass,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfClassList = res.data.Data.Rows
        }
      })
    }
  },
  created() {
    this.getEnums()
  },

  mounted() {
    this.init()
  },
  filters: {
    arroundType: (value, value1, value2, value3, value4, value5) => {
      let result = []
      let arr = []
      if (value) {
        arr = value.split(',')
        value3.forEach(m => {
          if (arr.indexOf(m.KeyId + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      if (value1) {
        arr = value1.split(',')
        value4.forEach(m => {
          if (arr.indexOf(m.KeyId + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      if (value2) {
        let arr = value2.split(',')
        value5.forEach(m => {
          if (arr.indexOf(m.KeyId + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      return result.join(',') || '全部'
    }
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    takingLog
  }
}
</script>
<style lang="scss">
.taking-create-dialog {
  .el-select.half-class {
    width: 100%
  }
}
</style>
