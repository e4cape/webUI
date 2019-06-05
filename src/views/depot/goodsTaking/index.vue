<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createBefore" name="btnCreate">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="onSearch" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in GoodsCountOrderBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" placeholder="单据编号" name="CountCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="盘点位置：" prop="WarehouseId" v-if="queryForm.ObjectType === GoodsCountOrderBasicObjectType.Company">
            <el-select v-model="queryForm.WarehouseId" placeholder="所有位置" :filterable="true" name="WarehouseId">
              <el-option label="所有位置" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="盘点位置：" prop="PositionNote" v-else>
            <el-select v-model="queryForm.PositionNote" name="PositionNote">
              <el-option label="所有位置" :value="''"></el-option>
              <el-option v-for="(item, index) in desks" :key="index" :label="item.Value" :value="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" name="takingCode"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select v-model="queryForm.CreateUserId" placeholder="全部" :filterable="true" name="CreateUserId">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="createTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="checkTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- Data Table -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="CountCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <template v-if="queryForm.ObjectType === GoodsCountOrderBasicObjectType.Company">
        <el-table-column prop="WarehouseName" label="盘点仓库" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PositionNote" label="盘点货架" min-width="100" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column v-else prop="PositionNote" label="盘点位置" min-width="100" key="PositionNote" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FilterNote" label="盘点范围" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="结束时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity1" label="应盘数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity3" label="盘亏数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity4" label="盘盈数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span :class="scope.row.State | findKey(GoodsCountOrderBasicState)">{{GoodsCountOrderBasicState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="240" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/goodstaking/check',query:{id:scope.row.CountId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State === GoodsCountOrderBasicState.Taking">
            <router-link :to="{path:'/depot/goodstaking/edit',query:{id:scope.row.CountId}}" class="btn-link el-button el-button--text">继续盘点</router-link>
            <el-button type="text" @click="cancelTaking($event, scope.row.CountId)">取消盘点</el-button>
          </template>
          <el-button type="text" @click="showTakingLogs(scope.row)" v-if="scope.row.State === GoodsCountOrderBasicState.Finish">盘点报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建柜台 -->
    <el-dialog title="新建盘点单" v-if="createDialogVisible" :visible.sync="createDialogVisible" class="taking-create-dialog" width="600px">
      <el-form :model="createForm" label-position="right" label-width="60px" :rules="createRules" ref="createForm" @close="resetCreateForm">
        <el-row class="m-b-10">
          <b>请选择盘点位置：</b>
        </el-row>
        <el-row>
          <el-col :span="24">
            <template v-if="this.queryForm.ObjectType === GoodsCountOrderBasicObjectType.Company">
              <el-form-item label="仓库：" prop="WarehouseId">
                <el-select v-model="createForm.WarehouseId" @change="getDelfIdList" name="WarehouseId">
                  <template v-for="(item, index) in $store.getters.wareHouses">
                    <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="货架：" prop="DelfIds">
                <el-checkbox-group v-model="createForm.DelfIds">
                  <template v-for="(item, index) in delfIdList">
                    <el-checkbox v-if="item.State === YNStatus.Yes" :key="index" :label="item.Id">{{item.Value}}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
            </template>
            <el-form-item label="位置：" prop="DelfIds" v-else>
              <el-checkbox-group v-model="createForm.DelfIds">
                <el-checkbox v-for="(item, index) in desks" :key="index" :label="item.Id">{{item.Value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="m-b-10">
          <b>请选择盘点范围：</b>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="材质：">
              <el-select v-model="createForm.MaterialTypes" placeholder="全部" multiple name="materialTypes" class="multi-select">
                <template v-for="(item, index) in $store.getters.materialType.TypeArray">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="品类：">
              <el-select v-model="createForm.CategoryTypes" placeholder="全部" multiple name="categoryTypes" class="multi-select">
                <template v-for="(item, index) in $store.getters.categoryType.TypeArray">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="成色：">
              <el-select v-model="createForm.GoldTypes" placeholder="全部" multiple name="goldTypes" class="multi-select">
                <template v-for="(item, index) in $store.getters.goldType.TypeArray">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="takingCreate" :loading="$store.getters.is_loading" name="btnTakingCreate">确 定</el-button>
        <el-button @click="createDialogVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建柜台 -->

    <!-- @module 盘点报告 -->
    <taking-log :visible.sync="takingLogVisible" :data="logBasicData"></taking-log>
    <!-- End 盘点报告 -->
  </el-row>
</template>

<script>
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  GoodsCountOrderBasicState,
  GoodsCountOrderBasicObjectType
} from '@/enums/stocking.js'
import { SecurityUserState } from '@/enums/merchant.js'
import {
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import takingLog from './takingLog'

export default {
  data() {
    return {
      YNStatus,
      GoodsCountOrderBasicState,
      GoodsCountOrderBasicObjectType,
      SecurityUserState,
      desks: [],
      delfIdList: [],
      queryForm: {
        // 查询表单数据
        WarehouseId: '0',
        CreateUserId: '0',
        PositionNote: '',
        ObjectType: 0,
        State: '0',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        CountCode: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: '',
        CreateTime: [],
        CheckTime: [],
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {},
      data: [],
      total: 0,
      createDialogVisible: false, // 新建盘点单
      takingLogVisible: false, // 盘点报告弹窗
      logBasicData: {},
      createForm: {
        WarehouseId: '',
        PositionNote: [],
        DelfIds: [],
        MaterialTypes: [],
        CategoryTypes: [],
        GoldTypes: []
      },
      createRules: {
        DelfIds: {
          required: true,
          message: '请选择盘点位置',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择盘点位置',
          trigger: 'change'
        }
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    getDelfIdList() {
      if (this.createForm.WarehouseId) {
        this.delfIdList = this.$store.getters.wareHouses
          .find(item => item.Id === this.createForm.WarehouseId)
          .Childrens.filter(item => item.State === YNStatus.Yes)
        this.createForm.DelfIds = this.delfIdList.map(item => item.Id)
      }
    },

    sortChange(sort) {
      switch (sort.prop) {
        case 'CountCode':
          this.parameters.OrderBy = 0
          break
        case 'CreateTime':
          this.parameters.OrderBy = 1
          break
        case 'CheckTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.initRoute()
    },
    getDesks() {
      this.$store.dispatch('GET_DESKS_DROPLIST').then(() => {
        this.desks = this.$store.getters.desks.filter(item => item.State === YNStatus.Yes)
        if (
          this.queryForm.ObjectType === GoodsCountOrderBasicObjectType.Store
        ) {
          this.createForm.DelfIds = this.desks.map(item => item.Id)
        }
      })
    },
    createBefore() {
      this.createDialogVisible = true
    },
    takingCreate() { // 创建盘点单
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let PositionNote
          if (
            this.queryForm.ObjectType === GoodsCountOrderBasicObjectType.Company
          ) {
            PositionNote = this.delfIdList
              .filter(item =>
                this.createForm.DelfIds.some(id => id === item.Id)
              )
              .map(item => item.Value)
              .join(',')
          } else {
            PositionNote = this.desks
              .filter(item =>
                this.createForm.DelfIds.some(id => id === item.Id)
              )
              .map(item => item.Value)
              .join(',')
          }

          let result = []
          this.createForm.MaterialTypes.forEach(a => {
            result.push(this.$store.getters.materialType.Types[a])
          })
          this.createForm.CategoryTypes.forEach(a => {
            result.push(this.$store.getters.categoryType.Types[a])
          })
          this.createForm.GoldTypes.forEach(a => {
            result.push(this.$store.getters.goldType.Types[a])
          })

          STOCKING_API_GOODS_COUNT_ORDER_BASIC_CREATE({
            WarehouseId: this.createForm.WarehouseId || 0,
            DelfIds: this.createForm.DelfIds,
            PositionNote: PositionNote,
            MaterialTypes: this.createForm.MaterialTypes.join(','),
            CategoryTypes: this.createForm.CategoryTypes.join(','),
            GoldTypes: this.createForm.GoldTypes.join(','),
            FilterNote: result.join(',') || '全部',
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.createDialogVisible = false
              this.$router.push({
                path: '/depot/goodstaking/edit',
                query: { id: res.data.Data }
              })
            }
          })
        }
      })
    },
    resetCreateForm() {
      this.$refs.createForm.resetFields()
    },
    showTakingLogs(row) {
      this.logBasicData = row
      this.takingLogVisible = true
    },
    cancelTaking($event, CountId) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_COUNT_ORDER_BASIC_CANCEL({
            CountId: CountId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            // 查询表单数据
            WarehouseId: '0',
            CreateUserId: '0',
            PositionNote: '',
            ObjectType: 0,
            State: '0',
            OrderBy: 1,
            IsAsced: YNStatus.No,
            CountCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            CreateTime: [],
            CheckTime: [],
            PageIndex: 1,
            PageSize: 20
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      query.ObjectType =
        this.characterType === CharacterType.Company
          ? GoodsCountOrderBasicObjectType.Company
          : GoodsCountOrderBasicObjectType.Store
      this.parameters = Object.assign({}, query)
      this.queryForm = {
        ...this.parameters
      }
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading

      STOCKING_API_GOODS_COUNT_ORDER_BASIC_GETS(this.parameters).then(res => {
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
      if (this.queryForm.CreateTime) {
        this.queryForm.CreateTime1 = this.queryForm.CreateTime[0]
        this.queryForm.CreateTime2 = this.queryForm.CreateTime[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      if (this.queryForm.CheckTime) {
        this.queryForm.CheckTime1 = this.queryForm.CheckTime[0]
        this.queryForm.CheckTime2 = this.queryForm.CheckTime[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      this.queryForm.isSenior = true
      if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.parameters = { ...this.queryForm }
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
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_CATEGORY_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_GOLD_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', { HasShelf: YNStatus.Yes, State: YNStatus.Yes })
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'State':
          return GoodsCountOrderBasicState.Types[val]
        case 'FilterNote':
          return val || '全部'
        default:
          break
      }
    }
  },
  created() {
    this.getStoreAllType()
    this.getDesks()
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
          if (arr.indexOf(m.Id + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      if (value1) {
        arr = value1.split(',')
        value4.forEach(m => {
          if (arr.indexOf(m.Id + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      if (value2) {
        let arr = value2.split(',')
        value5.forEach(m => {
          if (arr.indexOf(m.Id + '') > -1) {
            result.push(m.Value)
          }
        })
      }
      return result.join(',') || '全部'
    }
  },
  watch: {
    $route: 'init'
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
  .el-select.multi-select {
    width: 100%;
  }
}
</style>
