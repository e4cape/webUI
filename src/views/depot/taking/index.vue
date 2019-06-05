<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown @command="multiAudit">
            <el-button type="primary">
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="stuffType.Gold">金料盘点</el-dropdown-item>
              <el-dropdown-item :command="stuffType.Stone">石料盘点</el-dropdown-item>
              <el-dropdown-item :command="stuffType.Part">配件盘点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="changeType" placeholder="所有状态" name="state">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in stuffCountOrderBasicState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch" name="takingCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="CountCode">
            <el-input v-model="queryForm.CountCode" :maxlength="50" @keyup.enter.native="onSearch" name="takingCode"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select v-model="queryForm.CreateUserId" placeholder="全部" :filterable="true" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="盘点位置：" prop="WarehouseId">
            <el-select v-model="queryForm.WarehouseId" :filterable="true" name="createUserId">
              <el-option label="所有位置" :value="0"></el-option>
              <template v-for="(item, index) in $store.getters.wareHouses">
                <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="类别：" prop="StuffType">
            <el-select v-model="queryForm.StuffType" placeholder="全部" :filterable="true" name="createUserId">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="(item, index) in stuffType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" value-format="yyyy-MM-dd HH:mm:ss" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="createTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" value-format="yyyy-MM-dd HH:mm:ss" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="checkTime"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- Data Table -->
    <el-table :data="tableData" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CountCode" label="单据编号" min-width="140" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName" label="盘点位置" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName || '仓库'}}</template>
      </el-table-column>
      <el-table-column prop="PositionNote" label="盘点货架" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StuffType" label="类别" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">{{stuffType.Types[scope.row.StuffType]}}</template>
      </el-table-column>
      <el-table-column prop="Arround" label="盘点范围" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{arroundType(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="结束时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.CheckTime | filterDateMinutes }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity1" label="应盘" min-width="100" show-overflow-tooltip>
        <el-table-column prop="Quantity1" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight1" label="重量" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight1, 3)}}{{scope.row.StuffType == stuffType.Stone?'ct':'g'}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="Quantity2" label="实盘" min-width="100" show-overflow-tooltip>
        <el-table-column prop="Quantity2" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight2" label="重量" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight2, 3)}}{{scope.row.StuffType == stuffType.Stone?'ct':'g'}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="Quantity3" label="盘亏" min-width="100" show-overflow-tooltip>
        <el-table-column prop="Quantity3" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight3" label="重量" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight3, 3)}}{{scope.row.StuffType == stuffType.Stone?'ct':'g'}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="Quantity4" label="盘盈" min-width="100" show-overflow-tooltip>
        <el-table-column prop="Quantity4" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight4" label="重量" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight4, 3)}}{{scope.row.StuffType == stuffType.Stone?'ct':'g'}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="80" fixed="right">
        <template slot-scope="scope">
          <!-- <span :class="{'yellow': scope.row.State == stuffCountOrderBasicState.Taking, 'green': scope.row.State == stuffCountOrderBasicState.Finish, 'gray9': scope.row.State == stuffCountOrderBasicState.Cancel}">{{stuffCountOrderBasicState.Types[scope.row.State]}}</span> -->
          <span :class="scope.row.State | findKey(stuffCountOrderBasicState)">{{stuffCountOrderBasicState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/taking/check',query:{id:scope.row.CountId, StuffType: scope.row.StuffType}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State === stuffCountOrderBasicState.Taking">
            <router-link :to="{path:'/depot/taking/edit',query:{id: scope.row.CountId, StuffType: scope.row.StuffType}}" class="btn-link el-button el-button--text">继续盘点</router-link>
            <el-button type="text" @click="cancelTaking($event, scope.row)">取消盘点</el-button>
          </template>
          <el-button type="text" @click="showTakingLogs(scope.row)" v-if="scope.row.State === stuffCountOrderBasicState.Finish">盘点报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建柜台 -->
    <el-dialog title="新建盘点单" v-if="createDialog" :visible.sync="createDialog" class="taking-create-dialog" @close="resetCreateForm">
      <el-form :model="createForm" label-position="right" label-width="80px" :rules="createRules" ref="createForm">
        <el-row class="m-b-10">
          <b>请选择盘点位置：</b>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仓库：" prop="WarehouseId">
              <el-select v-model="createForm.WarehouseId" placeholder="请选择" @change="chooseHouse" :filterable="true" name="deskId">
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="货架：" prop="ShelfIds">
              <el-checkbox-group v-if="isChooseShelf" v-model="createForm.ShelfIds">
                <el-checkbox v-for="(item, index) in shelfs" :key="index" :label="item.Id">{{item.Value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="m-b-10">
          <b>请选择盘点范围：</b>
        </el-row>
        <el-row v-if="currType == stuffType.Gold">
          <el-col :span="24">
            <el-form-item label="成色：">
              <el-select v-model="GoldTypes" placeholder="全部" @change="changeGold" filterable multiple name="GoldTypes">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="currType == stuffType.Stone">
          <el-col :span="24">
            <el-form-item label="石类：">
              <el-select v-model="StoneClassTypeEks" @change="changeStone" placeholder="全部" filterable multiple name="StoneClassTypeEks">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in $store.getters.stone.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="currType == stuffType.Part">
          <el-col :span="24">
            <el-form-item label="配件：">
              <el-select v-model="PartTypeEks" @change="changePart" filterable placeholder="全部" multiple name="PartTypeEks">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in $store.getters.part.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer tc">
        <el-button type="primary" @click="takingCreate" :loading="$store.getters.is_loading" name="btnTakingCreate">确 定</el-button>
        <el-button @click="resetCreateForm" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建柜台 -->

    <!-- @module 盘点报告 -->
    <taking-log title="盘点报告" v-if="takingLogVisible" :takingLogVisible.sync="takingLogVisible" :takingData="takingData" @listenLogDialog="listenLogDialog"></taking-log>
    <!-- End 盘点报告 -->
  </el-row>
</template>

<script>
import {
  SecurityUserState
} from '@/enums/merchant.js'
import {
  YNStatus,
  StuffType
} from '@/enums/common.js'
import {
  StuffCountOrderBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_GETS,
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_CANCEL,
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_CREATE
} from '@/apis/stocking.js'
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import takingLog from './takingLog'

export default {
  data() {
    return {
      YNStatus,
      stuffType: StuffType,
      stuffCountOrderBasicState: StuffCountOrderBasicState,
      securityUserStates: SecurityUserState,
      queryForm: {
        // 查询表单数据
        CountCode: '',
        StuffType: 0,
        WarehouseId: 0,
        PositionNote: '',
        GoldTypes: '',
        PartTypeEks: '',
        StoneClassTypeEks: '',
        CreateUserId: '',
        CreateTime: [],
        CheckTime: [],
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
      },
      isChooseShelf: false,
      parameters: {},
      tableData: [],
      takingData: {},
      total: 0,
      createTime: [],
      shelfs: [],  // 货架
      createDialog: false, // 新建盘点单
      takingLogVisible: false, // 盘点报告弹窗
      CountId: '',
      currType: StuffType.Gold,
      createForm: {
        StuffType: null,
        WarehouseId: null,
        ShelfIds: [],
        PartTypeEks: '',
        PartTypeEvs: '',
        StoneClassTypeEks: '',
        StoneClassTypeEvs: '',
        GoldTypes: ''
      },
      lastTypes: [],
      GoldTypes: [],
      StoneClassTypeEks: [],
      StoneClassTypeEvs: [],
      PartTypeEks: [],
      PartTypeEvs: [],
      createRules: {
        WarehouseId: [{
          type: 'number',
          required: true,
          min: 0,
          message: '请选择盘点位置',
          trigger: 'change'
        }],
        ShelfIds: [{
          required: true,
          message: '货架不能为空'
        }]
      },
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            // 查询表单数据
            CountCode: '',
            StuffType: 0,
            WarehouseId: 0,
            PositionNote: '',
            GoldTypes: '',
            PartTypeEks: '',
            StoneClassTypeEks: '',
            CreateUserId: '',
            CreateTime: [],
            CheckTime: [],
            State: '0',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
          }
      this.parameters = Object.assign({}, query)
      this.parameters.StuffType = Number(this.parameters.StuffType)
      this.parameters.WarehouseId = Number(this.parameters.WarehouseId)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length ? this.parameters.CreateTime : [
        '',
        ''
      ]
      let checkTime = this.parameters.CheckTime.length ? this.parameters.CheckTime : [
        '',
        ''
      ]
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_STUFF_COUNT_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    chooseHouse(e) {
      // 获取当前选中项的下表
      for (let i = 0; i < this.$store.getters.wareHouses.length; i++) {
        if (e == this.$store.getters.wareHouses[i].Id) {
          this.shelfs = this.$store.getters.wareHouses[i].Childrens.filter(item => item.State === YNStatus.Yes)
          this.isChooseShelf = true
        }
      }
      this.createForm.ShelfIds = []
      this.shelfs.forEach(item => {
        this.createForm.ShelfIds.push(item.Id)
      })
    },
    changeType(e) {
      console.log('e', typeof e, e)
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'CountCode':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    arroundType(row) {
      let result = []
      let arr = []
      switch (row.StuffType) {
        case this.stuffType.Gold:
          arr = row.GoldTypes ? row.GoldTypes.split(',') : []
          arr.forEach(a => {
            if(this.$store.getters.goldType.Types[a]){
              result.push(this.$store.getters.goldType.Types[a])
            }  
          })
          return result.join(',') || '全部'

        case this.stuffType.Stone:
          return row.StoneClassTypeEvs.replace(/^,/,'')
        default:
          return row.PartTypeEvs.replace(/^,/,'')
      }
      
    },
    getHouseList() {
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
    },
    getSelect(type, newArr, enumsArr) {
      let isAdd = false
      let arr1 = newArr.concat(this.lastTypes).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })

      isAdd = newArr.length > this.lastTypes.length ? true : false
      if (isAdd) {
        if (arr1[0] == 0) { // 勾选的是全部
          this[type] = [0]
          enumsArr.forEach(item => {
            this[type].push(item.Id)
          })
        } else if (newArr.length == enumsArr.length) {
          this[type].push(0)
        }
      } else {
        if (arr1[0] == 0) { // 取消勾选的是全部
          this[type] = []
        } else if (newArr.indexOf(0) > -1) { // 取消勾选的不是全部,并且是否勾选全部
          this[type].splice(newArr.indexOf(0), 1)
        }
      }
      this.lastTypes = this[type]
    },
    changeGold() {
      this.getSelect('GoldTypes', this.GoldTypes, this.$store.getters.goldType.TypeArray)
    },
    changeStone() {
      this.getSelect('StoneClassTypeEks', this.StoneClassTypeEks, this.$store.getters.stone.TypeArray)
    },
    changePart() {
      this.getSelect('PartTypeEks', this.PartTypeEks, this.$store.getters.part.TypeArray)
    },
    takingCreate() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          switch (this.currType) {
            case this.stuffType.Gold:
              if(this.GoldTypes&&this.GoldTypes.length>0){
                this.createForm.GoldTypes = this.GoldTypes.join(',')
              }else{
                let arr = []
                this.$store.getters.goldType.TypeArray.forEach(item => {
                  arr.push(item.Id)
                })
                this.createForm.GoldTypes = arr.join(',')
              }
              break
            case this.stuffType.Stone:
              if(this.StoneClassTypeEks&&this.StoneClassTypeEks.length>0){
                this.createForm.StoneClassTypeEks = this.StoneClassTypeEks.join(',')
                this.StoneClassTypeEks.forEach(item => {
                  this.StoneClassTypeEvs.push(this.$store.getters.stone.Types[item])
                })
                this.createForm.StoneClassTypeEvs = this.StoneClassTypeEvs.join(',')
              }else{
                let arr = []
                this.$store.getters.stone.TypeArray.forEach(item => {
                  arr.push(item.Id)
                })
                this.createForm.StoneClassTypeEks = arr.join(',')
                arr.forEach(item => {
                  this.StoneClassTypeEvs.push(this.$store.getters.stone.Types[item])
                })
                this.createForm.StoneClassTypeEvs = this.StoneClassTypeEvs.join(',')
              }
              break
            default:
              if(this.PartTypeEks&&this.PartTypeEks.length>0){
                this.createForm.PartTypeEks = this.PartTypeEks.join(',')
                this.PartTypeEks.forEach(item => {
                  this.PartTypeEvs.push(this.$store.getters.part.Types[item])
                })
                this.createForm.PartTypeEvs = this.PartTypeEvs.join(',')
              }else{
                let arr = []
                this.$store.getters.part.TypeArray.forEach(item => {
                  arr.push(item.Id)
                })
                this.createForm.PartTypeEks = arr.join(',')
                arr.forEach(item => {
                  this.PartTypeEvs.push(this.$store.getters.part.Types[item])
                })
                this.createForm.PartTypeEvs = this.PartTypeEvs.join(',')
              }
              break
          }
          this.createForm.StuffType = this.currType

          // 货架名称数组
          let shelfArr = []

          for (let i = 0; i < this.shelfs.length; i++) {
            for (let j = 0; j < this.createForm.ShelfIds.length; j++) {
              if (this.createForm.ShelfIds[j] == this.shelfs[i].Id) {
                shelfArr.push(this.shelfs[i].Value)
              }
            }
          }
          this.createForm.PositionNote = shelfArr.join(',')
          this.$store.commit('SET_BTN_LOADING', true)
          console.log('this.createForm', this.createForm)
          STOCKING_API_STUFF_COUNT_ORDER_BASIC_CREATE(this.createForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.createDialog = false
              this.$router.push({
                path: '/depot/taking/edit',
                query: { id: res.data.Data, StuffType: this.currType }
              })
            }
          })
        }
      })
    },
    resetCreateForm() {
      console.log('已经开始 resetCreateForm 了')
      this.createDialog = false
      this.$refs['createForm'].resetFields()
      this.shelfs = []
      this.GoldTypes = []
      this.StoneClassTypeEks = []
      this.StoneClassTypeEvs = []
      this.PartTypeEks = []
      this.PartTypeEvs = []
      this.createForm = {
        StuffType: null,
        WarehouseId: null,
        ShelfIds: [],
        PartTypeEks: '',
        PartTypeEvs: '',
        StoneClassTypeEks: '',
        StoneClassTypeEvs: '',
        GoldTypes: ''
      }
    },
    getCreators() {
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    showTakingLogs(data) {
      this.takingData = data
      this.takingLogVisible = true
    },
    listenLogDialog() {
      this.takingLogVisible = false
    },
    multiAudit(command) {
      this.currType = command
      this.createDialog = true
      // 单个仓库时默认选中
      // if(this.$store.getters.wareHouses.filter(item => item.State == this.YNStatus.Yes).length === 1){
      //   this.createForm.WarehouseId = this.$store.getters.wareHouses[0].Id
      //   this.chooseHouse(this.createForm.WarehouseId)
      // }
    },
    cancelTaking($event, data) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_STUFF_COUNT_ORDER_BASIC_CANCEL({
            CountId: data.CountId,
            CheckNote: data.CheckNote,
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })

              this.getData()
            }
          })
        })
        .catch(() => { })
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
    getStoreAllType() {
      this.$store.dispatch('GET_STONE_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_PART_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_GOLD_TYPE', this.YNStatus.Yes)
    },
  },
  created() {
    this.getStoreAllType()
  },
  beforeMount() {
    this.getCreators()
    this.getHouseList()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
  },
  components: {
    searchPanel,
    pagination,
    takingLog
  }
}
</script>
<style lang="scss">
.taking-create-dialog .el-dialog {
  width: 600px;
}
.current-row {
  position: relative;
  .el-table_1_column_11 .cell {
    &::after {
      content: '';
      position: absolute;
      display: block;
      top: 10px;
      left: 10px;
      width: 20px;
      height: 20px;
      border: 4px solid red;
      border-radius: 50%;
    }
  }
}
</style>
