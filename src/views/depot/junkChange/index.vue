<template>
  <div class="content">
    <el-form :model="queryForm"  ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-dropdown class="multi-operation" @command="multiKind" name="btnmultiKind">
              <el-button type="primary">
                新建<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in $store.getters.kindType.TypeArray.filter(item =>{return item.State == YNStatus.Yes})" :key="index" :command="item.Id">{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-dropdown class="multi-operation" @command="multiAudit" name="btnMultiOperation">
              <el-button>
                批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>批量审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="(item,index) in junkChangeOrderBasicStates.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ChangeCode">
            <el-input v-model="queryForm.ChangeCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch" name="changeCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="ChangeCode" label="单据编号：">
            <el-input v-model="queryForm.ChangeCode" :maxlength="50" @keyup.enter.native="onSearch" name="changeCode"></el-input>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" filterable placeholder="全部" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="KindTypeEk" label="所有种类：">
            <el-select v-model="queryForm.KindTypeEk" filterable placeholder="所有种类" name="state">
              <el-option label="所有种类" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.kindType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReasonTypeDk" label="所有原因：">
            <el-select v-model="queryForm.ReasonTypeDk" filterable placeholder="所有原因" name="reasonId">
              <el-option label="所有原因" :value="0"></el-option>
              <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" @sort-change="sortChange" @selection-change="selectionChange" ref="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="ChangeCode" label="单据编号" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="KindTypeEv" label="种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="转换原因" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.GoldWeight, 3)}}g
        </template>
      </el-table-column>
      <el-table-column prop="CraftFee" label="加工费" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          ￥{{$root.toFloat(scope.row.CraftFee)}}
        </template>
      </el-table-column>
      <el-table-column prop="RecallPrice" label="成本" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- ￥{{$root.toFloat(scope.row.RecallPrice + scope.row.CraftFee)}} -->
          ￥{{$root.toFloat(scope.row.CostPrice)}}
        </template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.CheckTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <template v-if="(scope.row.State == junkChangeOrderBasicStates.Abandon || scope.row.State == junkChangeOrderBasicStates.Cancel || scope.row.State == junkChangeOrderBasicStates.Reject)&&scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(junkChangeOrderBasicStates)"> {{ junkChangeOrderBasicStates.Types[scope.row.State] }}</span>
            </el-tooltip>
            <!-- <span v-else style="color:red;"> {{ junkChangeOrderBasicStates.Types[scope.row.State] }}</span> -->
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(junkChangeOrderBasicStates)"> {{ junkChangeOrderBasicStates.Types[scope.row.State] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="ChangeId" label="操作" min-width="140" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/junkChange/check',query:{id:scope.row.ChangeId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State == junkChangeOrderBasicStates.Draft||scope.row.State == junkChangeOrderBasicStates.Reject">
            <router-link :to="{path:'/depot/junkChange/edit',query:{id:scope.row.ChangeId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button type="text" @click="openDialog(scope.row, 'abandonDialog')">作废</el-button>
          </template>
          <el-button v-if="scope.row.State == junkChangeOrderBasicStates.Wait" type="text" @click="openDialog(scope.row, 'auditDialog')" name="btnCheckJunkCancel">审核</el-button>
          <el-button v-if="scope.row.State == junkChangeOrderBasicStates.Audit" type="text" @click="openDialog(scope.row, 'cancelDialog')" name="btnCancelJunkOut">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·新建成品退货出库单 -->
    <el-dialog title="新建旧货转成品库" :visible.sync="createDialog" @close="resetForm" width="500px">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm">
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="15">
            <el-form-item label="旧货位置：" prop="WarehouseId1">
              <el-select class="m-r-10" v-model="createForm.WarehouseId1" @change="chooseHouse1" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item v-if="Shelfs1.length>0" class="shelf-box" prop="ShelfId1">
              <el-select v-model="createForm.ShelfId1" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs1" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="15">
            <el-form-item label="成品位置：" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="createForm.WarehouseId2" @change="chooseHouse2" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item v-if="Shelfs2.length>0" class="shelf-box" prop="ShelfId2">
              <el-select v-model="createForm.ShelfId2" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs2" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="转换原因：" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" filterable @change="selectReasons" placeholder="请选择" name="ReasonTypeDk">
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" class="font12" v-model="createForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createJunkList" :loading="$store.getters.is_loading" name="btnCreateJunkList">保 存</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品退货出库单 -->

    <!-- @module Dialog·新建转货原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkChangeOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建转货原因  -->

    <!-- 审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- 审核end -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End 作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="selections" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  JunkChangeOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GETS,
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      junkChangeOrderBasicStates: JunkChangeOrderBasicState,
      settingDictionaryDictType: SettingDictionaryDictType,
      tableData: [],
      reasonData: [], // 原因下拉
      total: 0,
      queryForm: {
        ChangeCode: '', // String旧货转换单号
        KindTypeEk: 0, // int32货品种类
        KindTypeEv: '',
        ReasonTypeDk: 0, // Int64字典序号(原因)
        ReasonTypeDv: '',
        CreateUserId: '', // Int64创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '', // DateTime 复核时间
        CheckTime2: '', // DateTime 复核时间
        State: 0, // Int32旧货转换单状态(枚举)
        OrderBy: 0, // Int32排序字段(0=创建时间,1=旧货转换单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32是否升序(枚举)
        PageIndex: '1', // Int32当前页码
        PageSize: '20', // Int32每页?条
        CheckTime: [], // 最后操作时间
        CreateTime: [] // 创建时间
      },
      createDialog: false,
      reasonDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      selections: [], // 选中的数据
      cancelJunkOuts: [],
      createForm: {
        WarehouseId1: '',
        ShelfId1: '',
        WarehouseId2: '',
        ShelfId2: '',
        KindTypeEk: '',
        KindTypeEv: '',
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: ''
      },
      junkAbandon: null,
      dialogTitle: '旧货转成品原因',
      Shelfs1: [],  // 旧货货架
      Shelfs2: [],  // 成品货架
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '转换原因不能为空',
            trigger: 'change'
          }
        ],
        WarehouseId1: [
          {required: true, message: '旧货仓库不能为空'}
        ],
        ShelfId1: [
          {required: true, message: '旧货货架不能为空'}
        ],
        WarehouseId2: [
          {required: true, message: '成品仓库不能为空'}
        ],
        ShelfId2: [
          {required: true, message: '成品货架不能为空'}
        ],
        KindTypeEk: [
          {required: true, message: '货品种类不能为空'}
        ]
      },
      parameters: {
      }
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        ChangeCode: '', // String旧货转换单号
        KindTypeEk: 0, // int32货品种类
        KindTypeEv: '',
        ReasonTypeDk: 0, // Int64字典序号(原因)
        ReasonTypeDv: '',
        CreateUserId: '', // Int64创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '', // DateTime 复核时间
        CheckTime2: '', // DateTime 复核时间
        State: 0, // Int32旧货转换单状态(枚举)
        OrderBy: 0, // Int32排序字段(0=创建时间,1=旧货转换单号,3=复核时间)
        IsAsced: this.YNStatus.No, // Int32是否升序(枚举)
        PageIndex: '1', // Int32当前页码
        PageSize: '20', // Int32每页?条
        CheckTime: [], // 最后操作时间
        CreateTime: [] // 创建时间
      }
      query.KindTypeEk = query.KindTypeEk? Number(query.KindTypeEk):0
      query.ReasonTypeDk = query.ReasonTypeDk? Number(query.ReasonTypeDk):0
      query.State = query.State? Number(query.State):0
      this.parameters = Object.assign({
      }, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.getData()
    },
    getData() {
      // 获取旧货列表
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime =  this.parameters.CreateTime.length ? this.parameters.CreateTime : ['', '']
      let checkTime =  this.parameters.CheckTime.length ? this.parameters.CheckTime : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        let result = res.data
        if (result.Code === 'CORRECT') {
          this.tableData = result.Data.Rows?result.Data.Rows: []
          this.total = result.Data.Count
        } else {
          this.$message.error(result.Message)
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    chooseHouse1(e) {
      this.Shelfs1 = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)

      this.createForm.ShelfId1 = this.Shelfs1.length == 1?this.Shelfs1[0].Id:''
    },
    chooseHouse2(e) {
      this.Shelfs2 = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)

      this.createForm.ShelfId2 = this.Shelfs2.length == 1?this.Shelfs2[0].Id:''
    },
    selectKind(e) {
      this.createForm.KindTypeEv = this.$store.getters.kindType.TypeArray.find(item => {
        return item.Id == e
      }).Value
    },
    selectReasons(e) {
      if(this.reasonData&&e){
        this.createForm.ReasonTypeDv = this.reasonData.find(item => {
          return item.Id == e
        }).Value
      }
    },
    createJunkList() {
      // 新建旧货转出库
      console.log(121, this.createForm, this.createForm.WarehouseId1, this.createForm.WarehouseId2, this.createForm.ShelfId1, this.createForm.ShelfId2)
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.createForm.WarehouseId1 = Number(this.createForm.WarehouseId1)||0
          this.createForm.WarehouseId2 = Number(this.createForm.WarehouseId2)||0
          this.createForm.ShelfId1 = Number(this.createForm.ShelfId1)||0
          this.createForm.ShelfId2 = Number(this.createForm.ShelfId2)||0
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_CHANGE_ORDER_BASIC_CREATE(this.createForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '提交成功！'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/depot/junkChange/edit',
                query: {
                  id: res.data.Data 
                }
              })
            } else {
              this.$message(res.data.Message, 'error')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    sortChange(sort) {
      // 排序
      switch (sort.prop) {
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        case 'ChangeCode':
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
    selectionChange(selection) {
      this.selections = selection
    },
    multiKind(command){
      this.createDialog = true
      this.createForm.KindTypeEk = command
      this.createForm.KindTypeEv = this.$store.getters.kindType.TypeArray.find(item => {
        return item.Id == command
      }).Value
      // 单个仓库时默认选中
      // if(this.$store.getters.wareHouses.filter(item => item.State == this.YNStatus.Yes).length === 1){
      //   this.createForm.WarehouseId1 = this.$store.getters.wareHouses[0].Id
      //   this.createForm.WarehouseId2 = this.$store.getters.wareHouses[0].Id
      //   this.chooseHouse1(this.createForm.WarehouseId1)
      //   this.chooseHouse2(this.createForm.WarehouseId2)
      // }
    },
    multiAudit() {
      // 批量审核
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.junkChangeOrderBasicStates.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的旧货转成品')
      } else {
        this.auditDialog = true
      }
    },
    openDialog(row, type){
      this.selections = [row]
      this[type] = true
    },
    resetForm() {
      // 重置新建表单
      this.$refs.createForm.resetFields()
    },
    listenDialog(type, success) {
      // 监听所有弹窗关闭
      this.selections = []
      this[type] = false
      this.$refs.tableData.clearSelection()
      if(success){
        this.init()
      }
    },
    listenDictSave() {
      this.getReasons()
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
        path: this.$router.path, query: this.parameters 
      })
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkChangeOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkChangeOrderBasicReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.reasonData = res.data.Data.Rows||[]
          if(!this.reasonData.some(item => item.Id === this.createForm.ReasonTypeDk)){
            this.createForm.ReasonTypeDk = ''
            this.createForm.ReasonTypeDv = ''
          }
        }
      })
    },
    getEnums(){
      this.$store.dispatch('GET_KIND_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
    }
  },
  beforeMount(){
    this.getReasons()
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    searchPanel,
    pagination,
    dictManage,
    auditDialog,
    abandonDialog,
    cancelDialog
  }
}
</script>

<style lang="scss" >
.inventor-title-form {
  width: 100%;
  padding: 5px 20px;
  overflow: hidden;
  .el-dropdown {
    vertical-align: middle;
    margin-left: 10px;
  }
  .left-title {
    margin-top: 3px;
    text-align: left;
  }
  .right-title {
    line-height: 30px;
    text-align: right;
    span {
      margin-right: 10px;
      font-size: 14px;
      b {
        font-size: 16px;
      }
    }
  }
}
</style>
