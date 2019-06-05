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
            @click="createIntake(kindTypes[0].Id)"
          >新建</el-button>
          <el-dropdown name="createIntake" @command="createIntake" v-else>
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
                v-for="item in HalfIntakeOrderBasicState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
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
          <el-form-item label="位置：" prop="location">
            <el-cascader
              name="location"
              :options="wareHouses"
              v-model="queryForm.Location"
              :props="props"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="单据编号：" prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
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
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="包号：" prop="PackageNo">
            <el-input
              name="PackageNo"
              v-model="queryForm.PackageNo"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="送货单号：" prop="ExpressCode">
            <el-input
              name="ExpressCode"
              v-model="queryForm.ExpressCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="采购员：" prop="ChargeUserId">
            <el-select filterable name="ChargeUserId" v-model="queryForm.ChargeUserId">
              <el-option label="全部" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.users"
                :key="item.UserId"
                :label="item.TrueName || item.AliasName"
                :value="String(item.UserId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              type="daterange"
              v-model="queryForm.ActualDate"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              type="daterange"
              v-model="queryForm.CheckTime"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
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
        prop="IntakeCode"
        fixed
        label="单据编号"
        min-width="140"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="PackageNo" label="包号" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KindTypeEv" label="种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName" label="入库位置" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName}}</template>
      </el-table-column>
      <el-table-column prop="PurchaseType" label="进货方式" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{purchaseTypes.Types[scope.row.PurchaseType]}}</template>
      </el-table-column>
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
      <el-table-column prop="ChargeUser" label="采购员" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="重量(g)" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="CostPrice" label="成本" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.CostPrice)}}</template>
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
            v-if="scope.row.State >= HalfIntakeOrderBasicState.Reject && scope.row.CheckNote"
          >
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(HalfIntakeOrderBasicState)"
            >{{HalfIntakeOrderBasicState.Types[scope.row.State] || '-'}}</span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(HalfIntakeOrderBasicState)"
            v-else
          >{{HalfIntakeOrderBasicState.Types[scope.row.State] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <router-link
            name="btnCheck"
            :to="{path:'/purchase/semiPackageArrival/semiArrivalCheck',query:{id:scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnEdit"
            :to="{path:'/purchase/semiPackageArrival/semiArrivalEdit',query:{id:scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
            v-if="scope.row.State == HalfIntakeOrderBasicState.Draft || scope.row.State == HalfIntakeOrderBasicState.Reject"
          >编辑</router-link>
          <el-button
            name="btnAudit"
            type="text"
            @click="showAudit(scope.row)"
            v-if="scope.row.State == HalfIntakeOrderBasicState.Wait"
          >审核</el-button>
          <el-button
            name="btnCancel"
            type="text"
            @click="cancelAudit(scope.row)"
            v-if="scope.row.State == HalfIntakeOrderBasicState.Audit"
          >取消审核</el-button>
          <el-button
            name="btnInvalid"
            type="text"
            @click="showInvalid(scope.row)"
            v-if="scope.row.State == HalfIntakeOrderBasicState.Draft || scope.row.State == HalfIntakeOrderBasicState.Reject"
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
      :title="createTitle"
      :visible.sync="createVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="createForm" label-width="100px" :rules="createRules" ref="createForm">
        <el-form-item label="包号：" prop="PackageNo">
          <el-input name="PackageNo" v-model="createForm.PackageNo" maxlength="30"></el-input>
        </el-form-item>
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
        <el-form-item label="采购员：" prop="ChargeUserId">
          <el-select
            name="ChargeUserId"
            v-model="createForm.ChargeUserId"
            @change="chargeUserChange"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.UserId"
              :label="item.TrueName || item.AliasName"
              :value="item.UserId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货方式：" prop="PurchaseType">
          <el-radio-group
            name="PurchaseType"
            v-model="createForm.PurchaseType"
            @change="purchaseChange"
          >
            <template v-for="item in purchaseTypes.TypeArray">
              <el-radio
                :label="parseInt(item.KeyId)"
                v-if="item.KeyId < purchaseTypes.WeiwGoods"
                :key="item.KeyId"
              >{{item.Value}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货品类别：" prop="FinanceType">
          <el-radio-group name="FinanceType" v-model="createForm.FinanceType">
            <el-radio :label="financeTypes.Self">{{financeTypes.Types[financeTypes.Self]}}</el-radio>
            <el-radio
              :label="financeTypes.Take"
              v-if="createForm.PurchaseType == purchaseTypes.Purchase"
            >{{financeTypes.Types[financeTypes.Take]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="送货单号：" prop="ExpressCode">
          <el-input name="ExpressCode" v-model="createForm.ExpressCode" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="入库位置：" prop="WarehouseId" class="location">
          <el-select name="WarehouseId" v-model="createForm.WarehouseId" @change="selectWareHouse">
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
        <el-button name="btnSave" type="primary" @click="createList('createForm')">保存</el-button>
        <el-button name="btnClose" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 新建 -->
    <!-- @module 批量审核 -->
    <el-dialog title="批量审核" :visible.sync="allCheck" width="580px">
      <div class="option">
        <span class="item">审核结果：</span>
        <el-radio-group name="isCheck" v-model="isCheck">
          <el-radio :label="HalfIntakeOrderBasicState.Audit">审核通过</el-radio>
          <el-radio :label="HalfIntakeOrderBasicState.Reject">审核退回</el-radio>
          <el-input
            name="checkNote"
            style="width:178px;"
            v-model="checkNote"
            :disabled="isCheck === HalfIntakeOrderBasicState.Audit"
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
          <span>{{detailInfo.IntakeCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detailInfo.CreateUser}}&nbsp;&nbsp;{{detailInfo.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="HalfIntakeOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="HalfIntakeOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === HalfIntakeOrderBasicState.Audit"
              @keyup.enter="isAudit"
              placeholder="退回原因备注"
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
              <span>{{detailInfo.IntakeCode}}</span>
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
  </el-row>
</template>

<script>
import { HalfIntakeOrderBasicState, FinanceType } from '@/enums/stocking'
import { PurchaseType, YNStatus, PartnerType } from '@/enums/common'
import { SecurityUserState } from '@/enums/merchant'
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_CREATE,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDITS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECTS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDIT,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECT,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_ABANDON,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCEL
} from '@/apis/stocking'
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      HalfIntakeOrderBasicState,
      YNStatus,
      partnerType: PartnerType,
      purchaseTypes: PurchaseType,
      financeTypes: FinanceType,
      queryForm: {
        State: '',
        KindTypeEk: '',
        PartnerId: '',
        ChargeUserId: '',
        Location: [''],
        ActualDate: '',
        CreateTime: '',
        CheckTime: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      users: [],
      kindTypes: [],
      wareHouses: [], // 位置
      shelf: [],
      total: 0,
      data: [],
      selectedProductId: [],
      selectedProduct: [],
      parameter: {},
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      createTitle: '新建',
      createForm: {
        PackageNo: '',
        PartnerId: '',
        KindTypeEk: '',
        KindTypeEv: '',
        ChargeUserId: '',
        ChargeUser: '',
        ExpressCode: '',
        Preprice: '',
        FinanceType: FinanceType.Self,
        ActualDate: dayjs(new Date()).format('YYYY-MM-DD'),
        PurchaseType: PurchaseType.Purchase,
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      createVisible: false, // 新建弹窗
      loading: false, // 新建按钮loading
      createRules: {
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ChargeUserId: {
          required: true,
          message: '请选择采购员',
          trigger: 'change'
        },
        PurchaseType: {
          required: true,
          message: '请输入进货方式',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择入库位置',
          trigger: 'change'
        },
        ShelfId: {
          required: true,
          message: '请选择货架位置',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
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
      flag: 0
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
      this.parameter.KindTypeEk = query.KindTypeEk || ''
      this.parameter.PartnerId = query.PartnerId || ''
      this.parameter.ChargeUserId = query.ChargeUserId || ''
      this.parameter.Location = Array.isArray(query.Location)
        ? query.Location[0]
          ? query.Location.map(item => parseInt(item))
          : ['']
        : query.Location
          ? [parseInt(query.Location)]
          : ['']
      this.parameter.ActualDate = query.ActualDate || []
      this.parameter.CreateTime = query.CreateTime || []
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
        ActualDate1: this.parameter.ActualDate[0],
        ActualDate2: this.parameter.ActualDate[1],
        CreateTime1: this.parameter.CreateTime[0],
        CreateTime2: this.parameter.CreateTime[1],
        CheckTime1: this.parameter.CheckTime[0],
        CheckTime2: this.parameter.CheckTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    createIntake(command) {
      // 新建弹窗
      this.createTitle = `新建（${
        this.$store.getters.kindType.Types[command]
      }）`
      this.createForm.KindTypeEk = command * 1
      this.createForm.KindTypeEv = this.$store.getters.kindType.Types[command]
      this.createForm.ChargeUserId = this.$store.getters.user_session.UserId
      this.createForm.ChargeUser =
        this.$store.getters.user_session.TrueName ||
        this.$store.getters.user_session.AliasName
      this.createVisible = true
    },
    handleClose() {
      this.$refs.createForm.resetFields()
      this.createVisible = false
    },
    purchaseChange() {
      if (this.createForm.PurchaseType === this.purchaseTypes.WeiwStuff) {
        this.createForm.FinanceType = this.financeTypes.Self
      }
    },
    chargeUserChange() {
      this.$store.getters.users.some(item => {
        if (item.UserId === this.createForm.ChargeUserId) {
          this.createForm.ChargeUser = item.TrueName
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
    createList(formName) {
      // 新建
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          STOCKING_API_HALF_INTAKE_ORDER_BASIC_CREATE({
            ...this.createForm,
            Preprice: this.$root.toInt(this.createForm.Preprice)
          }).then(res => {
            this.loading = false
            if (res.data.Code === 'CORRECT') {
              this.createVisible = false
              this.$refs['createForm'].resetFields()
              this.$router.push({
                path: '/purchase/semiPackageArrival/semiArrivalEdit',
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
      this.queryForm.Location = ['']
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
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'ActualDate':
          this.queryForm.OrderBy = 2
          break
        case 'IntakeCode':
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
        this.selectedProductId.push({ IntakeId: item.IntakeId })
      })
    },
    showAudit(row) {
      // 审核弹窗
      this.auditCheck = true
      this.checkNote = ''
      this.stateCheck = HalfIntakeOrderBasicState.Audit
      this.detailInfo = row
    },
    cancelAudit(row) {
      // 取消审核
      this.cancelName = 'cancel'
      this.detailInfo = row
      this.checkNote = ''
      this.cancelCheck = true
    },
    showInvalid(row) {
      // 作废
      this.cancelName = 'invalid'
      this.detailInfo = row
      this.checkNote = ''
      this.cancelCheck = true
    },
    showBatch() {
      if (
        this.selectedProduct.filter(item => {
          if (item.State !== this.HalfIntakeOrderBasicState.Wait) {
            return item
          }
        }).length > 0
      ) {
        return this.$message.error('请选择待审核的单据')
      }
      this.allCheck = true
    },
    isAudit() {
      // 审核、退回
      if (this.stateCheck === HalfIntakeOrderBasicState.Audit) {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDIT({
          IntakeId: this.detailInfo.IntakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECT({
          IntakeId: this.detailInfo.IntakeId,
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
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCEL({
          IntakeId: this.detailInfo.IntakeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_ABANDON({
          IntakeId: this.detailInfo.IntakeId,
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
    batchAudit() {
      // 批量审核、退回
      if (this.isCheck === HalfIntakeOrderBasicState.Audit) {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDITS({
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核成功')
            this.allCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECTS({
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
      this.$store.dispatch('GET_USERS_DROPLIST').then(res => {
        this.users = res.filter(item => {
          if (item.UserState === SecurityUserState.Audit) {
            return item
          }
        })
      })

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
  },
  mounted() {
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  components: {
    searchPanel,
    pagination
  },
  watch: {
    $route: 'init'
  }
}
</script>

<style lang="scss" scoped>
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