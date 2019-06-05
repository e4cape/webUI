<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown @command="multiAudit" name="btnMultiAudit">
            <el-button>
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="characterType != CharacterType.Company" :command="YNStatus.Yes">批量收货</el-dropdown-item>
              <el-dropdown-item :command="YNStatus.No">批量退回</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="(item,index) in JunkAllotOrderIntakeState.Types" :key="index" :label="item" :value="Number(index)"></el-option>
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
          <el-form-item prop="UnitedName1" label="来源：">
            <el-input v-model="queryForm.UnitedName1" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="OutakeCode" label="来源单号：">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item> -->
          <el-form-item prop="ExpressCode" label="快递单号：">
            <el-input v-model="queryForm.ExpressCode" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <el-form-item prop="CheckUser" label="收货人：">
            <el-input v-model="queryForm.CheckUser" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <el-form-item prop="ActualDate" label="业务日期：">
            <el-date-picker v-model="queryForm.ActualDate" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="SendTime" label="发货时间：">
            <el-date-picker v-model="queryForm.SendTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="IntakeTime" label="收货时间：">
            <el-date-picker v-model="queryForm.IntakeTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="ShippingType" label="收货方式">
            <el-select v-model="queryForm.ShippingType" filterable placeholder="所有方式" name="state">
              <el-option label="所有方式" :value="0"></el-option>
              <el-option v-for="(item,index) in ShippingType.Types" :key="index" :label="item" :value="Number(index)"></el-option>
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
      <el-table-column prop="UnitedName1" label="来源" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="OutakeCode" label="来源单号" min-width="140" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="Preprice" label="结算金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.Preprice)}}</template>
      </el-table-column>
      <el-table-column prop="ShippingType" label="收货方式" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{ShippingType.Types[scope.row.ShippingType]}}</template>
      </el-table-column>
      <el-table-column prop="ExpressCode" label="快递单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="SendTime" label="发货时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.SendTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="IntakeTime" label="收货时间" min-width="110" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.State == JunkAllotOrderIntakeState.Audit">{{scope.row.IntakeTime | filterDateTime}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="CheckUser" label="收货人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="characterType == this.CharacterType.Company" prop="WarehouseName2" label="收货仓库" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="70" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <template v-if="(scope.row.State == JunkAllotOrderIntakeState.Reject)&&scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span>{{ JunkAllotOrderIntakeState.Types[scope.row.State] }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="{'red': scope.row.State == JunkAllotOrderIntakeState.Wait}">{{ JunkAllotOrderIntakeState.Types[scope.row.State] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toCheckOut(scope.row.IntakeId)" name="btnCheck">查看</el-button>
          <el-button v-if="scope.row.State == JunkAllotOrderIntakeState.Wait" type="text" @click="junkDataInn(scope.row)">收货入库</el-button>
          <el-button
            v-if="scope.row.State == JunkAllotOrderIntakeState.Wait"
            type="text"
            @click="junkAbolish(scope.row)"
            name="btnJunkAbolish"
          >退回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->
    <!-- 分页 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 分页 end -->

    <!-- 收货入库 -->
    <el-dialog title="收货入库" :visible.sync="auditDialog" @close="auditDialog = false,$refs['auditForm'].resetFields()">
      <el-form :model="auditForm" :label-position="'right'" ref="auditForm" :rules="rules1" label-width="100px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="入库仓库" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="auditForm.WarehouseId2" @change="chooseHouse" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item class="shelf-box" prop="ShelfId2">
              <el-select v-model="auditForm.ShelfId2" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="junkInn" :loading="$store.getters.is_loading" name="btnJunkInn">确 定</el-button>
        <el-button @click="auditDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End-收货入库 -->

    <!-- 退回 -->
    <el-dialog title="退回" :visible.sync="returnDialog" @close="closeReturnDialog">
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="selections.length == 1">
          <el-col :span="12">
            <el-form-item label="单据编号：">
              <span>{{selections[0].OutakeCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货：">
              <span>{{selections[0].CreateUser + '&nbsp;&nbsp;&nbsp;'}}{{selections[0].ActualDate | filterDateMinutes}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="回退原因：">
            <el-input v-model="abandonReson" placeholder="作回退原因备注" :maxlength="200" name="abandonReason"></el-input>
          </el-form-item>
        </el-row>
        <el-row>退回后该单据回退到调拨出库的门店，并且不在本店显示，确定退回？</el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
        <el-button @click="closeReturnDialog" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End-退回 -->
  </div>
</template>

<script>
import {
  SettingDictionaryDictType,
  JunkAllotOrderIntakeState
} from '@/enums/stocking.js'
import {
  YNStatus,
  ShippingType,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_GETS,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVES,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURNS,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURN,
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      ShippingType,
      settingDictionaryDictType: SettingDictionaryDictType,
      JunkAllotOrderIntakeState,
      junkOutList: [],
      total: 0,
      abandonReson: '',
      queryForm: {
        OutakeCode: '', // String 旧货出库单号
        ActualDate1: '', // 业务日期(开始)
        ActualDate2: '', // 业务日期(结束)
        SendTime1: '', // 发货时间
        SendTime2: '', // 发货时间
        IntakeTime1: '', // 收货时间
        IntakeTime2: '', // 收货时间
        State: 0, // Int32 状态(枚举)
        UnitedName1: '',  // 发货方名称聚合
        ShippingType: 0, // 收货方式(枚举)
        ExpressCode: '', // 快递单号
        CheckUser: '', // 	收货人员
        OrderBy: 0, // Int32 排序字段(0=创建时间,1=旧货出库单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        ActualDate: [],
        SendTime: [],
        IntakeTime: []
      },
      auditForm: {
        WarehouseId2: '',
        ShelfId2: ''
      },
      reasonName: '旧货出库原因',
      createDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      isBatch: false, // 是否是批量操作
      selections: [], // 选中的数据
      createForm: {
        ReasonId: '',
        Reasons: '',
        TargetName: '',
        Note: ''
      },
      Shelfs: [],
      detail: {
      },
      rules1: {
        WarehouseId2: [
          {
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ],
        ShelfId2: [
          {
            required: true,
            message: '请选择货架',
            trigger: 'change'
          }
        ]
      },
      rules: {
        ReasonId: [
          {
            type: 'number',
            required: true,
            message: '请选择出库原因',
            trigger: 'change'
          }
        ]
      },
      returnDialog: false,
      parameters: {}
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        OutakeCode: '', // String 旧货出库单号
        ActualDate1: '', // 业务日期(开始)
        ActualDate2: '', // 业务日期(结束)
        SendTime1: '', // 发货时间
        SendTime2: '', // 发货时间
        IntakeTime1: '', // 收货时间
        IntakeTime2: '', // 收货时间
        State: 0, // Int32 状态(枚举)
        UnitedName1: '',  // 发货方名称聚合
        ShippingType: 0, // 收货方式(枚举)
        ExpressCode: '', // 快递单号
        CheckUser: '', // 	收货人员
        OrderBy: 0, // Int32 排序字段(0=创建时间,1=旧货出库单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        ActualDate: [],
        SendTime: [],
        IntakeTime: []
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.State = Number(query.State) || 0
      this.parameters.ShippingType = Number(query.ShippingType) || 0
      this.parameters.ActualDate = query.ActualDate || []
      this.parameters.SendTime = query.SendTime || []
      this.parameters.IntakeTime = query.IntakeTime || []
      this.getData()
    },
    getData() {
      // 旧货出库列表
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let actualDate = this.parameters.ActualDate.length ? this.parameters.ActualDate : ['', '']
      let sendTime = this.parameters.SendTime.length ? this.parameters.SendTime : ['', '']
      let intakeTime = this.parameters.IntakeTime.length ? this.parameters.IntakeTime : ['', '']
      let param = {
        ActualDate1: actualDate[0],
        ActualDate2: actualDate[1],
        SendTime1: sendTime[0],
        SendTime2: sendTime[1],
        IntakeTime1: intakeTime[1],
        IntakeTime2: intakeTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_GETS(this.queryForm).then(res => {
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
        case 'SendTime':
          this.queryForm.OrderBy = 1
          break
        case 'IntakeTime':
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
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit(command) {
      if(this.selections.length == 0){
        this.$message.error('所选单据不能为空')
        return
      }
      // 批量操作 Wait     Draft Reject
      this.isBatch = true
      if (command == this.YNStatus.Yes) {// 批量收货
        if (this.selections.every(item => {
          return item.State == this.JunkAllotOrderIntakeState.Wait
        })) {
          if (this.characterType != this.CharacterType.Store) {
            this.auditDialog = true
          } else {
            this.junkInn(true)
          }
        } else {
          this.$message.error('批量收货的订单状态为待收货')
          return false
        }
      } else { // 批量退回
        this.abandonReson = ''
        if (this.selections.length > 0) {
          if (this.selections.every(item => {
            return item.State == this.JunkAllotOrderIntakeState.Wait
          })) {
            this.returnDialog = true
          } else {
            this.$message.error('批量退回的订单状态为待收货')
            return false
          }
        }
      }
    },
    junkDataInn(row) {
      // 门店端没有弹窗
      this.isBatch = false
      this.selections = [row]
      if (this.characterType == this.CharacterType.Store) {
        this.junkInn()
      } else {
        this.auditDialog = true
        this.auditForm.WarehouseId2 = row.WarehouseId2||''
        console.log('this.auditForm', this.auditForm)
        this.chooseHouse(this.auditForm.WarehouseId2, row)
      }
    },
    junkInn() {
      if (this.selections.length == 0) {
        this.$message.error('选中项不能为空？')
      }
      if(this.characterType == this.CharacterType.Store){
        this.junkInnGoods()
      }else {
        this.$refs['auditForm'].validate((valid) => {
          if(valid){
            this.junkInnGoods()
          }
        })
      }
    },
    junkInnGoods(){
      let apiMethod = ''
      let obj1 = {}
      let obj2 = {}
      let IntakeId = 0
      let Items = []
      if (this.isBatch) { // 判断是否是批量处理
        apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVES
        this.selections.forEach(item => {
          Items.push({IntakeId: item.IntakeId})
          if (item.State != this.JunkAllotOrderIntakeState.Wait) {
            return this.$message.error('批量收货的订单状态为待收货')
          }
        })
        if(this.characterType == this.CharacterType.Store){
          obj1 = { Items: Items }
        }else{
          obj1 = { Items: Items, WarehouseId2: this.auditForm.WarehouseId2, ShelfId2: this.auditForm.ShelfId2  }
        }
      } else {
        apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE
        IntakeId = this.selections[0].IntakeId
        obj1 = { IntakeId: IntakeId }
      }
      if (this.characterType == this.CharacterType.Store) {
        obj2 = obj1
      } else {
        obj2 = Object.assign({}, obj1, { WarehouseId2: this.auditForm.WarehouseId2, ShelfId2: this.auditForm.ShelfId2 })
      }
      apiMethod(obj2).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.auditDialog = false
          this.getData()
        }
      })
    },
    junkAbolish(row) {
      this.selections = [row]
      this.returnDialog = true
      this.isBatch = false
    },
    api(flag,obj){
      if(flag){
        return STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURNS(obj)
      }else{
        return STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURN(obj)
      }
    },
    makeAbandon() {
      let Items = [], IntakeId = 0,obj = {}
      if (this.isBatch) {
        this.selections.forEach(item => {
          Items.push({IntakeId: item.IntakeId})
        })
        obj = { Items: Items, CheckNote: this.abandonReson }
      } else {
        IntakeId = this.selections[0].IntakeId
        obj = { IntakeId: IntakeId, CheckNote: this.abandonReson }
      }

      this.api(this.isBatch,obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.returnDialog = false
          this.getData()
        }
      })
    },
    closeReturnDialog(){
      this.returnDialog = false
      this.abandonReson = ''
      this.$refs.junkOutList.clearSelection()
    },
    chooseHouse(e, row) {
      if(e){ // 仓库有数据才会获取货架数据
        this.Shelfs = this.$store.getters.wareHouses.find(item => {
          return item.Id == e
        }).Childrens.filter(item => {return item.State == this.YNStatus.Yes})
      }
      if(row){ // 公司调公司才会有收货的仓库和货架
        this.auditForm.ShelfId2 = row.ShelfId2||''
      }else{
        if (this.Shelfs.length == 1) { // 货架只有一个时默认选中
          this.auditForm.ShelfId2 = this.Shelfs[0].Id
        }else{
          this.auditForm.ShelfId2 = ''
        }
      }
    },
    toCheckOut(id) {
      // 查看
      this.$router.push({
        path: '/depot/junkAllotInn/check',
        query: {
          id: id
        }
      })
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
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      // 业务日期
      this.$store.dispatch('GET_SETTLE_DATE')
    }
  },
  beforeMount(){
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    'queryForm.ReasonId': 'onSearch'
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
