<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button
            type="primary"
            v-if="kindTypes.length === 0"
            @click="$message.warning('请行在“系统设置”的“科目设置”中添加种类')"
          >新建</el-button>
          <el-button
            type="primary"
            v-else-if="kindTypes.length === 1"
            @click="createMaterial(kindTypes[0].Id)"
          >新建</el-button>
          <el-dropdown name="createMaterial" @command="createMaterial" v-else>
            <span class="el-dropdown-link">
              <el-button type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in kindTypes"
                :command="item.Id"
                :key="item.Id"
              >{{item.Value}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown name="handleCommand" @command="showBatch">
            <span class="el-dropdown-link m-l-10">
              <el-button>
                批量操作
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="audit" :disabled="selectedProductId.length === 0">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select
              name="State"
              v-model="queryForm.State"
              placeholder="所有状态"
              @change="onSearch"
              :filterable="true"
            >
              <el-option label="所有状态" :value="''"></el-option>
              <el-option
                v-for="item in HalfReturnOrderBasicState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="billCode">
            <el-input
              name="billCode"
              v-model="queryForm.ReturnCode"
              placeholder="单据编号"
              maxlength="30"
              @keyup.enter.native="onSearch"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="种类：" prop="KindTypeEk">
            <el-select
              name="KindTypeEk"
              v-model="queryForm.KindTypeEk"
              placeholder="所有种类"
              :filterable="true"
            >
              <el-option label="所有种类" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.kindType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退货原因：" prop="ReasonTypeDk">
            <el-select filterable name="ReasonTypeDk" v-model="queryForm.ReasonTypeDk">
              <el-option label="所有原因" :value="''"></el-option>
              <el-option
                v-for="item in resonType"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置：" prop="Location">
            <el-cascader
              name="Location"
              :options="wareHouses"
              v-model="queryForm.Location"
              change-on-select
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="单据编号：" prop="ReturnCode">
            <el-input
              name="ReturnCode"
              v-model="queryForm.ReturnCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select filterable name="PartnerId" v-model="queryForm.PartnerId">
              <el-option label="所有供应商" :value="''"></el-option>
              <template v-for="item in $store.getters.suppliers">
                <el-option
                  v-if="(item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                  :key="item.Id"
                  :label="item.Value"
                  :value="String(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="queryForm.CreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              type="daterange"
              v-model="queryForm.ActualDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              type="daterange"
              v-model="queryForm.CheckTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        prop="ReturnCode"
        fixed
        label="单据编号"
        min-width="140"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="位置" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName}}</template>
      </el-table-column>
      <el-table-column prop="ReasonTypeDv" label="退货原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="ActualDate"
        label="业务日期"
        min-width="95"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        min-width="100"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="重量(g)" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
      </el-table-column>
      <el-table-column prop="Preprice" label="应付款" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.Preprice)}}</template>
      </el-table-column>
      <el-table-column
        prop="CheckTime"
        label="最后操作时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="State" fixed="right" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip
            placement="top"
            effect="light"
            v-if="scope.row.State >= HalfReturnOrderBasicState.Reject && scope.row.CheckNote"
          >
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(HalfReturnOrderBasicState)"
            >{{HalfReturnOrderBasicState.Types[scope.row.State] || '-'}}</span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(HalfReturnOrderBasicState)"
            v-else
          >{{HalfReturnOrderBasicState.Types[scope.row.State] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <router-link
            name="btnCheck"
            :to="{path:'/purchase/semiReturnOutbound/returnOutboundCheck',query:{id:scope.row.ReturnId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnEdit"
            :to="{path:'/purchase/semiReturnOutbound/returnOutboundEdit',query:{id:scope.row.ReturnId}}"
            class="btn-link el-button el-button--text"
            v-if="scope.row.State == HalfReturnOrderBasicState.Draft || scope.row.State == HalfReturnOrderBasicState.Reject"
          >编辑</router-link>
          <el-button
            name="btnAudit"
            type="text"
            @click="audit(scope.row)"
            v-if="scope.row.State == HalfReturnOrderBasicState.Wait"
          >审核</el-button>
          <el-button
            name="btnCancel"
            type="text"
            @click="cancelAudit(scope.row)"
            v-if="scope.row.State == HalfReturnOrderBasicState.Audit"
          >取消审核</el-button>
          <el-button
            name="btnInvalid"
            type="text"
            @click="invalid(scope.row)"
            v-if="scope.row.State == HalfReturnOrderBasicState.Draft || scope.row.State == HalfReturnOrderBasicState.Reject"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- 分页 -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- End 分页 -->
    <!-- 新建 -->
    <el-dialog
      :title="typeValue"
      :visible.sync="createVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="createForm" label-width="100px" :rules="createRules" ref="createForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select filterable name="PartnerId" v-model="createForm.PartnerId">
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="退货位置：" prop="WarehouseId" class="location">
          <el-select
            filterable
            name="WarehouseId"
            v-model="createForm.WarehouseId"
            @change="selectWareHouse"
          >
            <template v-for="item in $store.getters.wareHouses">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="ShelfId" class="location shelf" v-if="createForm.WarehouseId">
          <el-select filterable name="ShelfId" v-model="createForm.ShelfId">
            <template v-for="item in shelf">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因：" prop="ReasonTypeDk">
          <el-select filterable name="ReasonTypeDk" v-model="createForm.ReasonTypeDk">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in resonType"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-button
            name="btnColumnVisible"
            type="text"
            class="return-reason"
            @click="returnVisible = true"
          >
            <i class="icon-set"></i>
          </el-button>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            name="ActualDate"
            v-model="createForm.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input
            name="Preprice"
            v-model="createForm.Preprice"
            @keyup.native="createForm.Preprice = $root.toFixed(createForm.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="createForm.Note" maxlength="200"></el-input>200个字以内
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          name="btnSave"
          type="primary"
          :loading="loading"
          @click="createList('createForm')"
        >保存</el-button>
        <el-button name="btnClose" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 新建 -->
    <!-- @module 批量审核 -->
    <el-dialog title="批量审核" :visible.sync="allCheck" width="580px">
      <div class="option">
        <span class="item">审核结果：</span>
        <el-radio-group name="isCheck" v-model="isCheck">
          <el-radio :label="HalfReturnOrderBasicState.Audit">审核通过</el-radio>
          <el-radio :label="HalfReturnOrderBasicState.Reject">审核退回</el-radio>
          <el-input
            name="checkNote"
            style="width:178px;"
            v-model="checkNote"
            :disabled="isCheck === HalfReturnOrderBasicState.Audit"
            placeholder="退回原因备注"
            @keyup.enter="batchAudit"
            maxlength="200"
          ></el-input>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnBatchAudit" type="primary" @click="batchAudit">确定</el-button>
        <el-button name="btnClose" @click="allCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 批量审核 -->
    <!-- @module 审核 -->
    <el-dialog title="审核" :visible.sync="auditCheck" width="580px">
      <el-form
        label-position="right"
        label-width="80px"
        :model="detailInfo"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="单据编号：">
          <span>{{detailInfo.ReturnCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detailInfo.CreateUser}}&nbsp;&nbsp;{{detailInfo.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="HalfReturnOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="HalfReturnOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === HalfReturnOrderBasicState.Audit"
              placeholder="退回原因备注"
              @keyup.enter="isAudit"
              maxlength="200"
            ></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnIsAudit" type="primary" @click="isAudit">确定</el-button>
        <el-button name="btnClose" @click="auditCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 审核 -->
    <!-- @module 取消审核/作废确认 -->
    <el-dialog
      :title="cancelName === 'cancel' ? '取消审核' : '作废确认'"
      :visible.sync="cancelCheck"
      width="580px"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="detailInfo"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span>{{detailInfo.ReturnCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span>{{detailInfo.CreateUser}}&nbsp;&nbsp;{{detailInfo.CreateTime | filterDateMinutes}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="cancelName === 'cancel' ? '取消原因：' : '作废原因：'">
          <el-input
            name="checkNote"
            v-model="checkNote"
            :placeholder="cancelName === 'cancel' ? '取消原因备注' : '作废原因备注'"
            @keyup.enter="isCancel"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <div>{{cancelName === 'cancel' ? '取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？' : '作废后该单据所产生的库存等业务数据也将回退，确定作废？'}}</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnIsCancel" type="primary" @click="isCancel">确定</el-button>
        <el-button name="btnClose" @click="cancelCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 取消审核/作废确认 -->
    <dict-manage
      v-if="returnVisible"
      :visible.sync="returnVisible"
      :dicts="resonType"
      :dialogTitle="'退货原因'"
      :dictType="SettingDictionaryDictType.HalfReturnOrderBasicReasonType"
      @listenDictSave="getReasonType"
    ></dict-manage>
  </el-row>
</template>

<script>
import {
  HalfReturnOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking'
import { EnableState, YNStatus, PartnerType } from '@/enums/common'
import {
  STOCKING_API_HALF_RETURN_ORDER_BASIC_GETS,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_CREATE,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDITS,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDIT,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECTS,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECT,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_ABANDON,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_CANCEL
} from '@/apis/stocking'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'

export default {
  data() {
    return {
      HalfReturnOrderBasicState,
      SettingDictionaryDictType,
      EnableState,
      YNStatus,
      partnerType: PartnerType,
      queryForm: {
        Location: [''],
        KindTypeEk: '',
        ReasonTypeDk: '',
        ReturnCode: '',
        CreateTime: '',
        PartnerId: '',
        ActualDate: '',
        CheckTime: '',
        State: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      selectedProductId: [],
      selectedProduct: [],
      parameter: {},
      kindTypes: [],
      wareHouses: [], // 所有位置
      shelf: [], // 货架位置
      createForm: {
        PartnerId: '',
        WarehouseId: '',
        ShelfId: '',
        KindTypeEk: 0,
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        ActualDate: dayjs(new Date()).format('YYYY-MM-DD'),
        Note: ''
      },
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      resonType: [], // 退货原因
      createVisible: false, // 新建弹窗
      loading: false, // 新建按钮loading
      typeValue: '',
      createRules: {
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择退货位置',
          trigger: 'change'
        },
        ShelfId: {
          required: true,
          message: '请选择货架位置',
          trigger: 'change'
        }
      },
      detailInfo: {},
      checkNote: '',
      auditCheck: false, // 审核弹窗
      cancelCheck: false, // 取消/作废弹窗
      cancelName: 'cancel',
      stateCheck: 5, // 审核结果
      allCheck: false, // 批量审核
      isCheck: 5, // 批量审核结果
      returnVisible: false,
      returnReason: []
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.State = query.State || ''
      this.parameter.Location = Array.isArray(query.Location)
        ? query.Location[0]
          ? query.Location.map(item => parseInt(item))
          : ['']
        : query.Location
          ? [parseInt(query.Location)]
          : ['']
      this.parameter.KindTypeEk = query.KindTypeEk || ''
      this.parameter.ReasonTypeDk = query.ReasonTypeDk || ''
      this.parameter.ReturnCode = query.ReturnCode || ''
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.PartnerId = query.PartnerId || ''
      this.parameter.ActualDate = query.ActualDate || []
      this.parameter.CheckTime = query.CheckTime || []
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        WarehouseId: this.parameter.Location[0],
        ShelfId: this.parameter.Location[1],
        CreateTime1: this.parameter.CreateTime[0],
        CreateTime2: this.parameter.CreateTime[1],
        ActualDate1: this.parameter.ActualDate[1],
        ActualDate2: this.parameter.ActualDate[0],
        CheckTime1: this.parameter.CheckTime[0],
        CheckTime2: this.parameter.CheckTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_RETURN_ORDER_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    selectWareHouse() {
      let shelf = this.$store.getters.wareHouses.find(
        item => item.Id === this.createForm.WarehouseId
      )
      this.shelf = shelf ? shelf.Childrens : []
      if (this.shelf.length === 1) {
        this.createForm.ShelfId = this.shelf[0].Id
      } else {
        this.createForm.ShelfId = ''
      }
    },
    createMaterial(command) {
      this.typeValue = `新建（${this.$store.getters.kindType.Types[command]}）`
      this.createForm.KindTypeEk = command * 1
      this.createForm.KindTypeEv = this.$store.getters.kindType.Types[command]
      this.createVisible = true
      this.getReasonType()
    },
    handleClose() {
      this.$refs.createForm.resetFields()
      this.createVisible = false
    },
    createList(formName) {
      // 新建
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.createForm.ReasonTypeDk === '') {
            this.createForm.ReasonTypeDk = 0
          } else {
            this.resonType.some(item => {
              if (this.createForm.ReasonTypeDk === item.Id) {
                this.createForm.ReasonTypeDv = item.Value
              }
            })
          }
          this.loading = true
          STOCKING_API_HALF_RETURN_ORDER_BASIC_CREATE({
            ...this.createForm,
            Preprice: this.$root.toInt(this.createForm.Preprice)
          }).then(res => {
            this.loading = false
            if (res.data.Code === 'CORRECT') {
              this.createVisible = false
              this.$refs['createForm'].resetFields()
              this.$router.push({
                path: '/purchase/semiReturnOutbound/returnOutboundEdit',
                query: { id: res.data.Data }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameter = Object.assign({}, this.queryForm)
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
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    sortChange(sort) {
      // 表单排序
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'ActualDate':
          this.queryForm.OrderBy = 2
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'ReturnCode':
          this.queryForm.OrderBy = 3
          break
        default:
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.selectedProductId = []
      this.selectedProduct = val
      val.forEach(item => {
        this.selectedProductId.push({ ReturnId: item.ReturnId })
      })
      console.log(
        this.selectedProduct.filter(item => {
          if (item.State !== this.HalfReturnOrderBasicState.Audit) {
            return item
          }
        })
      )
    },
    audit(row) {
      // 审核弹窗
      this.detailInfo = row
      this.checkNote = ''
      this.stateCheck = HalfReturnOrderBasicState.Audit
      this.auditCheck = true
    },
    cancelAudit(row) {
      // 取消审核
      this.cancelName = 'cancel'
      this.detailInfo = row
      this.checkNote = ''
      this.cancelCheck = true
    },
    invalid(row) {
      // 作废
      this.cancelName = 'invalid'
      this.detailInfo = row
      this.checkNote = ''
      this.cancelCheck = true
    },
    showBatch() {
      if (
        this.selectedProduct.filter(item => {
          if (item.State !== this.HalfReturnOrderBasicState.Wait) {
            return item
          }
        }).length > 0
      ) {
        return this.$message.error('请选择待审核的单据')
      }
      this.allCheck = true
    },
    batchAudit() {
      // 批量审核、退回
      if (this.isCheck === HalfReturnOrderBasicState.Audit) {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDITS({
          Items: this.selectedProductId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核成功')
            this.allCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECTS({
          CheckNote: this.checkNote,
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核退回成功')
            this.allCheck = false
            this.getData()
          }
        })
      }
    },
    isAudit() {
      // 审核、退回
      if (this.stateCheck === HalfReturnOrderBasicState.Audit) {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDIT({
          ReturnId: this.detailInfo.ReturnId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECT({
          ReturnId: this.detailInfo.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('退回成功')
            this.auditCheck = false
            this.getData()
          }
        })
      }
    },
    isCancel() {
      // 取消、作废
      if (this.cancelName === 'cancel') {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_CANCEL({
          ReturnId: this.detailInfo.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_RETURN_ORDER_BASIC_ABANDON({
          ReturnId: this.detailInfo.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      }
    },
    listenDictDialog() {
      // 关闭栏目管理弹窗
      this.semiClassifyVisible = false
      this.getReasonType()
    },
    // 获取半成品退货原因
    getReasonType() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfReturnOrderBasicReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.resonType = res.data.Data.Rows || []
        }
      })
    },
    getStoreAllType() {
      this.$store
        .dispatch('GET_WAREHOUSES_DROPLIST', {
          HasShelf: YNStatus.Yes,
          State: YNStatus.Yes
        })
        .then(res => {
          this.wareHouses = [
            {
              Id: '',
              Value: '所有位置',
              Childrens: null
            },
            ...res
          ]
        })
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_KIND_TYPE').then(res => {
        this.kindTypes = res.filter(item => {
          if (item.State === YNStatus.Yes) {
            return item
          }
        })
      })
    }
  },
  created() {
    this.getStoreAllType()
    this.getReasonType()
  },
  mounted() {
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  components: {
    searchPanel,
    pagination,
    dictManage
  },
  watch: {
    $route: 'init'
  }
}
</script>

<style lang="scss" scoped>
.return-reason {
  font-size: 18px;
  vertical-align: -webkit-baseline-middle;
  padding-top: 2px;
  padding-left: 5px;
}
.location {
  display: inline-block;
  /deep/ .el-select > .el-input {
    width: 140px;
  }
}
.shelf {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
}
</style>
