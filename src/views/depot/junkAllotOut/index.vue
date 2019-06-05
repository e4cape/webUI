<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialog = true,getUsers()" name="btnCreate">新建</el-button>
          <el-dropdown @command="multiAudit" name="btnMultiAudit">
            <el-button>
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="(item,index) in junkAllotOrderOutakeState.Types" :key="index" :label="item" :value="Number(index)"></el-option>
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
          <el-form-item prop="UnitedName2" label="收货单位：">
            <el-input v-model="queryForm.UnitedName2" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="ActualDate" label="业务日期：">
            <el-date-picker v-model="queryForm.ActualDate" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" filterable placeholder="全部" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ExpressCode" label="快递单号：">
            <el-input v-model="queryForm.ExpressCode" :maxlength="50" @keyup.enter.native="onSearch" name="targetName"></el-input>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="ReasonTypeDk" label="所有原因：">
            <el-select v-model="queryForm.ReasonTypeDk" filterable placeholder="所有原因" name="reasonId">
              <el-option label="所有原因" :value="0"></el-option>
              <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShippingType" label="收货方式：">
            <el-select v-model="queryForm.ShippingType" filterable placeholder="所有方式" name="state">
              <el-option label="所有方式" :value="0"></el-option>
              <el-option v-for="(item, index) in ShippingType .TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="IntakeState" label="收货情况：">
            <el-select v-model="queryForm.IntakeState" filterable placeholder="所有情况" name="state">
              <el-option label="所有情况" :value="0"></el-option>
              <el-option v-for="(item,index) in JunkAllotOrderIntakeState.Types" :key="index" :label="item" :value="Number(index)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- 表格 -->
    <el-table :data="junkOutList" ref="junkOutList" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="OutakeCode" label="单据编号" sortable="custom" min-width="140" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="UnitedName2" label="收货单位" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.WarehouseName2&&characterType == CharacterType.Company?scope.row.WarehouseName2:scope.row.UnitedName2}}
        </template>
      </el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="110" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="Preprice" label="结算金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.Preprice)}}</template>
      </el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShippingType" label="收货方式" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">{{ShippingType.Types[scope.row.ShippingType]}}</template>
      </el-table-column>
      <el-table-column prop="ExpressCode" label="快递单号" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <template
            v-if="(scope.row.State == junkAllotOrderOutakeState.Abandon || scope.row.State == junkAllotOrderOutakeState.Cancel || scope.row.State == junkAllotOrderOutakeState.Reject)&&scope.row.CheckNote"
          >
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(junkAllotOrderOutakeState)">{{ junkAllotOrderOutakeState.Types[scope.row.State] }}</span>
            </el-tooltip>
            <!-- <span v-else style="color:red;"> {{ junkAllotOrderOutakeState.Types[scope.row.State] }}</span> -->
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(junkAllotOrderOutakeState)">{{ junkAllotOrderOutakeState.Types[scope.row.State] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="IntakeState" label="收货情况" min-width="90" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <!-- {{scope.row.IntakeState?JunkAllotOrderIntakeState.Types[scope.row.IntakeState]: '-'}} -->
          <el-tooltip
            :disabled="!(scope.row.IntakeCheckNote && scope.row.IntakeState === JunkAllotOrderIntakeState.Reject || scope.row.IntakeTime && scope.row.IntakeState === JunkAllotOrderIntakeState.Audit)"
            class="item"
            :content="scope.row.IntakeState === JunkAllotOrderIntakeState.Reject ? scope.row.IntakeCheckNote : $options.filters.filterDateMinutes(scope.row.IntakeTime)"
            placement="top"
            effect="light"
          >
            <span>{{JunkAllotOrderIntakeState.Types[scope.row.IntakeState]||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" min-width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toCheckOut(scope.row.OutakeId)" name="btnCheck">查看</el-button>
          <el-button
            v-if="scope.row.State == junkAllotOrderOutakeState.Reject || scope.row.State == junkAllotOrderOutakeState.Draft "
            type="text"
            @click="toEditOut(scope.row.OutakeId)"
            name="btnToEditOut"
          >编辑</el-button>
          <el-button v-if="scope.row.State == junkAllotOrderOutakeState.Wait" type="text" @click="openDialog(scope.row, 'auditDialog')" name="btnJunkOutCheck">审核</el-button>
          <el-button
            v-if="scope.row.State == junkAllotOrderOutakeState.Draft || scope.row.State == junkAllotOrderOutakeState.Reject"
            type="text"
            @click="openDialog(scope.row, 'abandonDialog')"
            name="btnJunkAbolish"
          >作废</el-button>
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
            <el-form-item label="发货位置：" prop="WarehouseId1">
              <el-select class="m-r-10" v-model="createForm.WarehouseId1" @change="chooseHouse1" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item v-if="Shelfs1.length>0" class="shelf-box" prop="ShelfId1">
              <el-select v-model="createForm.ShelfId1" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs1">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="调拨原因：" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" filterable @change="selectReasons" placeholder="请选择" name="ReasonTypeDk">
            <template v-for="(item, index) in reasonData">
              <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-row>
          <el-col :span="9">
            <el-form-item v-if="characterType == CharacterType.Company" label="收货单位：" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="createForm.WarehouseId2" @change="chooseHouse2" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in getStoHou($store.getters.wareHouses, $store.getters.stores)">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
                <!-- <el-option v-for="(item,index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.Id"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item v-else label="收货单位：" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="createForm.WarehouseId2" @change="chooseHouse2" placeholder="请选择" :filterable="true" name="StuffType">
                <el-option label="总部仓库" :value="0"></el-option>
                <template v-for="(item,index) in $store.getters.stores">
                  <el-option v-if="item.State == YNStatus.Yes && item.Id !== 0 && item.CharacterId !== $store.getters.user_session.CharacterId" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
                <!-- <el-option v-for="(item,index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.Id"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="Shelfs2.length>0" :span="15">
            <el-form-item v-if="$store.getters.stores.every(item => {return item.Id != createForm.WarehouseId2})" class="shelf-box" prop="ShelfId2">
              <el-select v-model="createForm.ShelfId2" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs2">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker v-model="createForm.ActualDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="$store.getters.businessDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="收货方式：" prop="ShippingType">
          <el-radio-group v-model="createForm.ShippingType" name="ShippingType">
            <el-radio :label="ShippingType.PickedUp">{{ShippingType.Types[ShippingType .PickedUp]}}</el-radio>
            <el-radio :label="ShippingType.Express">{{ShippingType.Types[ShippingType .Express]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快递公司：" prop="ExpressType">
          <el-select v-model="createForm.ExpressType" filterable placeholder="请选择" name="ExpressType">
            <el-option label="请选择" value="0"></el-option>
            <el-option v-for="(item, index) in ExpressType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：" prop="ExpressCode">
          <el-input v-model="createForm.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
        </el-form-item>
        <el-form-item label="发货人：" prop="SendUser">
          <el-input v-model="createForm.SendUser" :maxlength="50" name="SendUser"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话：" prop="SendPhone">
          <el-input v-model="createForm.SendPhone" :maxlength="50" name="SendPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货人：" prop="ReceiptUser">
          <el-input v-model="createForm.ReceiptUser" :maxlength="50" name="ReceiptUser"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话：" prop="ReceiptPhone">
          <el-input v-model="createForm.ReceiptPhone" :maxlength="50" name="ReceiptPhone"></el-input>
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

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage
      v-if="reasonDialog"
      :visible.sync="reasonDialog"
      :dicts="reasonData"
      :dialogTitle="dialogTitle"
      :dictType="settingDictionaryDictType.JunkAllotOrderOutakeReasonType"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建退货原因  -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  YNStatus,
  ShippingType,
  ExpressType,
  CharacterType
} from '@/enums/common.js'
import {
  SettingDictionaryDictType,
  JunkAllotOrderOutakeState,
  JunkAllotOrderIntakeState,
} from '@/enums/stocking.js'
import {
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GETS,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import junkAudit from './audit'
import junkAbandon from './abandon'
export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      settingDictionaryDictType: SettingDictionaryDictType,
      junkAllotOrderOutakeState: JunkAllotOrderOutakeState,
      ShippingType,
      ExpressType,
      JunkAllotOrderIntakeState,
      junkOutList: [],
      reasonData: [],
      total: 0,
      queryForm: {
        OutakeCode: '', // 调拨出库单号
        UnitedName2: '',
        ReasonTypeDk: 0, // 字典序号(原因)
        ReasonTypeDv: '',
        ShippingType: 0,
        ExpressCode: '', // 快递单号
        ActualDate1: '',
        ActualDate2: '',
        CreateUserId: '', // Int64 创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '',
        CheckTime2: '',
        IntakeState: 0,
        State: 0, // Int32 
        OrderBy: 0, // Int32 排序字段(0=创建时间,1=旧货出库单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        CreateTime: [],
        CheckTime: [],
        ActualDate: []
      },
      Shelfs1: [], // 发货货架
      Shelfs2: [], // 收货货架
      dialogTitle: '旧货调拨出库原因',
      createDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      selections: [], // 选中的数据
      currId: '',
      createForm: {
        WarehouseId1: null,
        ShelfId1: null,
        WarehouseId2: null,
        ShelfId2: null,
        StorechterId2: null,
        ActualDate: new Date(),
        ReasonTypeDk: null,
        ReasonTypeDv: '',
        ShippingType: null,
        ExpressType: null,
        ExpressCode: '',
        SendUser: '',
        SendPhone: '',
        ReceiptUser: '',
        ReceiptPhone: ''
      },
      returnReasons: [],
      detail: {
      },
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '调拨原因不能为空',
            trigger: 'change'
          }
        ],
        WarehouseId1: [
          { required: true, message: '旧货仓库不能为空' }
        ],
        ShelfId1: [
          { required: true, message: '旧货货架不能为空' }
        ],
        WarehouseId2: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ],
        ShelfId2: [
          { required: true, message: '货架不能为空' }
        ],
        KindTypeEk: [
          { required: true, message: '货品种类不能为空' }
        ],
        ShippingType: [
          { required: true, message: '收货方式不能为空' }
        ],
        ActualDate: [
          { required: true, message: '业务日期不能为空' }
        ]
      },
      reasonDialog: false,
      parameters: {
      }
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        OutakeCode: '', // 调拨出库单号
        UnitedName2: '',
        ReasonTypeDk: 0, // 字典序号(原因)
        ReasonTypeDv: '',
        ShippingType: 0,
        ExpressCode: '', // 快递单号
        ActualDate1: '',
        ActualDate2: '',
        CreateUserId: '', // Int64 创建人员序号
        CreateTime1: '', // DateTime创建时间
        CreateTime2: '', // DateTime创建时间
        CheckTime1: '',
        CheckTime2: '',
        IntakeState: 0,
        State: 0, // Int32 
        OrderBy: 0, // Int32 排序字段(0=创建时间,1=旧货出库单号,3=复核时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
        CreateTime: [],
        CheckTime: [],
        ActualDate: []
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.ReasonTypeDk = Number(this.parameters.ReasonTypeDk)
      this.parameters.ShippingType = Number(this.parameters.ShippingType)
      this.parameters.IntakeState = Number(this.parameters.IntakeState)
      this.parameters.State = Number(this.parameters.State)
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
        ActualDate2: actualDate[1],
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.junkOutList = res.data.Data.Rows
          this.total = res.data.Data.Count
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getUsers() {
      this.$store.getters.users.forEach(item => {
        if (item.UserId == this.$store.getters.user_session.UserId) {
          this.createForm.SendUser = item.TrueName ? item.TrueName : item.AliasName
          this.createForm.SendPhone = item.Mobile
        }
      })
      // 单个仓库时默认选中
      // if(this.$store.getters.wareHouses.filter(item => item.State == this.YNStatus.Yes).length === 1){
      //   this.createForm.WarehouseId1 = this.$store.getters.wareHouses[0].Id
      //   this.createForm.WarehouseId2 = this.$store.getters.wareHouses[0].Id
      //   this.chooseHouse1(this.createForm.WarehouseId1)
      //   this.chooseHouse2(this.createForm.WarehouseId2)
      // }
    },
    selectReasons(e) {
      if (this.reasonData && e) {
        this.createForm.ReasonTypeDv = this.reasonData.find(item => {
          return item.Id == e
        }).Value
      }
    },
    getStoHou(arr1, arr2) {
      return arr1.concat(arr2.filter(item => { return item.State == this.YNStatus.Yes }))
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
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    chooseHouse1(e) {
      this.Shelfs1 = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)

      this.createForm.ShelfId1 = this.Shelfs1.length == 1 ? this.Shelfs1[0].Id : ''
    },
    chooseHouse2(e) {
      if (this.$store.getters.stores.every(item => { return item.Id != this.createForm.WarehouseId2 })) {
        this.Shelfs2 = this.$store.getters.wareHouses.find(item => {
          return item.Id == e
        }).Childrens.filter(item => item.State === YNStatus.Yes)

        this.createForm.ShelfId2 = this.Shelfs2.length == 1 ? this.Shelfs2[0].Id : ''
      } else {
        this.$store.getters.stores.forEach(item => {
          if (item.Id == this.createForm.WarehouseId2) {
            this.createForm.StorechterId2 = item.CharacterId
          }
        })
      }
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit() {
      // 批量审核
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.junkAllotOrderOutakeState.Wait) {
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
          if (this.createForm.StorechterId2) {
            this.createForm.WarehouseId2 = 0
            this.createForm.ShelfId2 = 0
          }
          if (
            this.createForm.WarehouseId1 === this.createForm.WarehouseId2 &&
            this.createForm.ShelfId1 === this.createForm.ShelfId2 &&
            this.createForm.WarehouseId1 &&
            this.createForm.ShelfId1
          ) {
            this.$message.warning('收货位置和发货位置不能相同')
            return false
          }
          this.$store.commit('SET_BTN_LOADING', true)
          let obj = { ...this.createForm }
          obj.ExpressType = Number(obj.ExpressType) || 0
          obj.ActualDate = dayjs(obj.ActualDate).format('YYYY-MM-DD')
          STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_CREATE(obj).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '提交成功！'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/depot/junkAllotOut/edit',
                query: {
                  id: res.data.Data
                }
              })
            } else {
              this.$message.warning(res.data.Message)
              this.createForm.ExpressType = String(this.createForm.ExpressType)
              this.createForm.WarehouseId2 = ''
              this.createForm.StorechterId2 = 0
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
        WarehouseId1: null,
        ShelfId1: null,
        WarehouseId2: null,
        ShelfId2: null,
        StorechterId2: null,
        ReasonTypeDk: null,
        ReasonTypeDv: '',
        ShippingType: null,
        ExpressType: null,
        ExpressCode: '',
        SendUser: '',
        SendPhone: '',
        ReceiptUser: '',
        ReceiptPhone: ''
      }
      this.$refs['createForm'].resetFields()
    },
    openDialog(row, type) {
      this.selections = [row]
      this[type] = true
    },
    toCheckOut(id) {
      // 查看
      this.$router.push({
        path: '/depot/junkAllotOut/check',
        query: {
          id: id
        }
      })
    },
    toEditOut(id) {
      // 编辑
      this.$router.push({
        path: '/depot/junkAllotOut/edit',
        query: {
          id: id
        }
      })
    },
    getReturnReasonValue(id) {
      let result = ''
      this.returnReasons.forEach(item => {
        if (item.Id === id) {
          result = item.Value
          return false
        }
      })
      return result
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', { DictType: this.settingDictionaryDictType.JunkAllotOrderOutakeReasonType, State: this.YNStatus.Yes })
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkAllotOrderOutakeReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.reasonData = res.data.Data.Rows || []
          if (!this.reasonData.some(item => item.Id === this.createForm.ReasonTypeDk)) {
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
      if (success) {
        this.onSearch()
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      console.log('this.parameters1', this.parameters, 'this.queryForm', this.queryForm)
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
    getEnums() {
      // 获取创建人 
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_STORES_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', { HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes })
      // 业务日期
      this.$store.dispatch('GET_SETTLE_DATE')
    }
  },
  beforeMount() {
    this.getReasons()
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
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
    junkAbandon,
    junkAudit
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
