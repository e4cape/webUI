<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialog = true" name="btnCreate">新建</el-button>
          <el-dropdown @command="multiAudit" name="btnMultiAudit">
            <el-button>
              批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in JunkOutakeOrderBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch" name="outCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="OutakeCode" label="单据编号：">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" @keyup.enter.native="onSearch" name="outCode"></el-input>
          </el-form-item>
          <el-form-item prop="TargetName" label="出库对象：">
            <el-input v-model="queryForm.TargetName" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <el-form-item prop="ActualDate" label="业务日期：">
            <el-date-picker v-model="queryForm.ActualDate" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item v-if="characterType != CharacterType.Store" prop="WarehouseId" label="出库仓库：">
            <el-select class="m-r-10" v-model="queryForm.WarehouseId" placeholder="请选择" :filterable="true" name="WarehouseId">
              <el-option label="请选择" value="0"></el-option>
              <template v-for="(item,index) in $store.getters.wareHouses">
                <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" filterable placeholder="全部" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option v-if="item.TrueName"  :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="所有原因" prop="ReasonTypeDk">
            <el-select v-model="queryForm.ReasonTypeDk" filterable placeholder="所有原因" name="ReasonTypeDk">
              <el-option label="所有原因" value="0"></el-option>
              <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="String(item.Id)
              "></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- 表格 -->
    <el-table 
      :data="junkOutList"
      ref="junkOutList" 
      @sort-change="sortChange" 
      @selection-change="selectionChange" 
      v-loading="$store.getters.tb_loading" 
      element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="OutakeCode" label="单据编号" sortable="custom" min-width="140" show-overflow-tooltip fixed></el-table-column>
      <el-table-column v-if="characterType != CharacterType.Store" prop="WarehouseName" label="出库仓库" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="出库原因" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TargetName" label="出库对象" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="业务日期" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ActualDate | filterDate}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateMinutes}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.GoldWeight, 3)}}g
        </template>
      </el-table-column>
      <el-table-column prop="Preprice" label="金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          ￥{{$root.toFloat(scope.row.Preprice)}}
        </template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.CheckTime | filterDateMinutes}}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="90" fixed="right">
        <template slot-scope="scope">
          <template v-if="(scope.row.State == JunkOutakeOrderBasicState.Abandon || scope.row.State == JunkOutakeOrderBasicState.Cancel || scope.row.State == JunkOutakeOrderBasicState.Reject)&&scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(JunkOutakeOrderBasicState)"> {{ JunkOutakeOrderBasicState.Types[scope.row.State] }}</span>
            </el-tooltip>
            <!-- <span v-else style="color:red;"> {{ JunkOutakeOrderBasicState.Types[scope.row.State] }}</span> -->
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(JunkOutakeOrderBasicState)"> {{ JunkOutakeOrderBasicState.Types[scope.row.State] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toCheckOut(scope.row.OutakeId)" name="btnCheck">查看</el-button>
          <el-button v-if="scope.row.State == JunkOutakeOrderBasicState.Reject || scope.row.State == JunkOutakeOrderBasicState.Draft " type="text" @click="toEditOut(scope.row.OutakeId)" name="btnToEditOut">编辑</el-button>
          <el-button v-if="scope.row.State == JunkOutakeOrderBasicState.Wait" type="text" @click="openDialog(scope.row, 'auditDialog')" name="btnJunkOutCheck">审核</el-button>
          <el-button v-if="scope.row.State == JunkOutakeOrderBasicState.Audit" type="text" @click="openDialog(scope.row, 'cancelDialog')" name="btnJunkOutCheck">取消审核</el-button>
          <el-button v-if="scope.row.State == JunkOutakeOrderBasicState.Draft || scope.row.State == JunkOutakeOrderBasicState.Reject" type="text" @click="openDialog(scope.row, 'abandonDialog')" name="btnJunkAbolish">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->
    <!-- 分页 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 分页 end -->

    <!-- @module Dialog·新建成品退货出库单 -->
    <el-dialog title="新建旧货出库" :visible.sync="createDialog" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm">
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="9">
            <el-form-item label="出库仓库：" prop="WarehouseId">
              <el-select class="m-r-10" v-model="createForm.WarehouseId" @change="chooseHouse" placeholder="请选择" :filterable="true" name="WarehouseId">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="Shelfs.length>0" :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="createForm.ShelfId" placeholder="请选择" label-width="0" :filterable="true" name="ShelfId">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出库原因：" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" :filterable="true" @change="selectReasons2" placeholder="请选择" name="ReasonTypeDk">
            <template v-for="(item, index) in reasonData">
              <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="出库对象：">
          <el-input v-model="createForm.TargetName" :maxlength="50" name="targetName"></el-input>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker v-model="createForm.ActualDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="$store.getters.businessDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" class="font12" v-model="createForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createJunkOut" :loading="$store.getters.is_loading" name="btnCreateJunkOut">保 存</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品退货出库单 -->

    <!-- @module Dialog·审核 -->
    <junk-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenDialog"></junk-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <junk-abandon title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenDialog"></junk-abandon>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <junk-cancel title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="selections" @listenCancelDialog="listenDialog"></junk-cancel>
    <!-- End Dialog·取消审核 -->

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkOutakeOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建退货原因  -->

  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  YNStatus,
  ShippingType,
  CharacterType
} from '@/enums/common.js'
import {
  SettingDictionaryDictType,
  JunkOutakeOrderBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GETS,
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_CREATE,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import junkAudit from './audit.vue'
import junkAbandon from './abandon.vue'
import junkCancel from './cancel.vue'
export default {
  data() {
    return {
      YNStatus,
      JunkOutakeOrderBasicState,
      CharacterType,
      settingDictionaryDictType: SettingDictionaryDictType,
      ShippingType,
      junkOutList: [],
      Shelfs: [],
      reasonData: [], // 原因下拉
      total: 0,
      queryForm: {
        OutakeCode: '', // String 旧货出库单号
        TargetName: '', // String 出库对象
        ReasonTypeDk: null, // 字典序号(原因)
        ReasonTypeDv: '', // 字典序号(原因)
        CreateUserId: '', // Int64 创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '', // DateTime 复核时间
        CheckTime2: '', // DateTime 复核时间
        ActualDate1: '', // 业务日期
        ActualDate2: '', // 业务日期
        State: '0', // Int32 旧货出库单状态(枚举)
        WarehouseId: '0',
        OrderBy: 1, // Int32 排序字段(0=创建时间,1=旧货出库单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        CreateTime: [],
        CheckTime: [],
        ActualDate: []
      },
      dialogTitle: '旧货其他出库原因',
      createDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      selections: [], // 选中的数据
      createForm: {
        WarehouseId: null,
        ShelfId: null,
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        TargetName: '',
        ActualDate: dayjs(new Date()).format('YYYY-MM-DD'),
        Note: ''
      },
      returnReasons: [],
      detail: {
      },
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择出库原因',
            trigger: 'change'
          }
        ],
        WarehouseId: [
          {required: true, message: '请选择出库仓库'}
        ],
        ShelfId: [
          {required: true, message: '请选择出库货架'}
        ],
        ActualDate: [
          {required: true, message: '请选择业务日期'}
        ],
      },
      reasonDialog: false,
      parameters: {
      }
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        OutakeCode: '', // String 旧货出库单号
        TargetName: '', // String 出库对象
        ReasonTypeDk: null, // 字典序号(原因)
        ReasonTypeDv: '', // 字典序号(原因)
        CreateUserId: '', // Int64 创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '', // DateTime 复核时间
        CheckTime2: '', // DateTime 复核时间
        ActualDate1: '', // 业务日期
        ActualDate2: '', // 业务日期
        State: '0', // Int32 旧货出库单状态(枚举)
        OrderBy: 1, // Int32 排序字段(1=创建时间,0=旧货出库单号,2=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        CreateTime: [],
        CheckTime: [],
        ActualDate: []
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.parameters.ActualDate = query.ActualDate || []
      this.getData()
    },
    getData() {
      // 旧货出库列表
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length ? this.parameters.CreateTime : ['', '']
      let checkTime = this.parameters.CheckTime.length ? this.parameters.CheckTime : ['', '']
      let actualDate = this.parameters.ActualDate.length ? this.parameters.ActualDate : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1],
        ActualDate1: actualDate[0],
        ActualDate2: actualDate[1]
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.junkOutList = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      // 列表排序
      switch (sort.prop) {
        case 'OutakeCode':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 1
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    selectReasons2(){
      if(this.reasonData&&this.createForm.ReasonTypeDk){
        this.createForm.ReasonTypeDv = this.reasonData.find(item => {
          return item.Id == this.createForm.ReasonTypeDk
        }).Value
      }
    },
    multiAudit() {
      // 批量审核
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.JunkOutakeOrderBasicState.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的旧货出库单')
      } else {
        this.auditDialog = true
      }
    },
    createJunkOut() {
      // 新建旧货出库
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_CREATE(this.createForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '提交成功！'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/depot/junkOtherOut/edit',
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
    cancelJunkOut(row) {
      // 取消审核
      this.selections = row
      this.cancelDialog = !this.cancelDialog
    },
    resetForm() {
      // 重置新建表单
      this.createForm = {
        WarehouseId: null,
        ShelfId: null,
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        TargetName: '',
        Note: ''
      }
    },
    chooseHouse(e) {
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)
      if(this.Shelfs.length == 1){
        this.createForm.ShelfId = this.Shelfs[0].Id
      } else {
        this.createForm.ShelfId = ''
      }
    },
    openDialog(row, type) {
      // 审核
      this.selections = [row]
      this[type] = true
      console.log(111, type)
    },
    junkAbolish(row) {
      // 作废
      this.selections = row
      this.abandonDialog = true
    },
    toCheckOut(id) {
      // 查看
      this.$router.push({
        path: '/depot/junkOtherOut/check',
        query: {
          id: id 
        }
      })
    },
    toEditOut(id) {
      // 编辑
      this.$router.push({
        path: '/depot/junkOtherOut/edit',
        query: {
          id: id 
        }
      })
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkOutakeOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkOutakeOrderBasicReasonType,
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
    listenDictSave() {
      this.getReasons()
    },
    listenDialog(type, success) {
      this.selections = []
      this[type] = false
      this.$refs.junkOutList.clearSelection()
      // 监听所有弹窗的关闭
      if(success){
        this.onSearch()
      }
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
    getEnums(){
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      // 业务日期
      this.$store.dispatch('GET_SETTLE_DATE')
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  beforeMount() {
    this.getEnums()
    this.getReasons()
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
    dictManage,
    junkAbandon,
    junkAudit,
    junkCancel
  }
}
</script>

<style lang="scss">
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
