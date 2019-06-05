<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown name="createMaterial" @command="createMaterial">
            <span class="el-dropdown-link">
              <el-button type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item.KeyId"
                v-for="item in StuffType.TypeArray"
                :key="item.KeyId"
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
                v-for="item in StuffIntakeOrderBasicState.TypeArray"
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
          <el-form-item label="位置：" prop="Location">
            <el-cascader
              name="Location"
              :options="wareHouses"
              v-model="queryForm.Location"
              change-on-select
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="类型：" prop="StuffType">
            <el-select
              name="StuffType"
              v-model="queryForm.StuffType"
              placeholder="所有类型"
              :filterable="true"
            >
              <el-option label="所有类型" :value="''"></el-option>
              <el-option
                v-for="item in StuffType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方式：" prop="PurchaseType">
            <el-select
              name="PurchaseType"
              v-model="queryForm.PurchaseType"
              placeholder="所有方式"
              :filterable="true"
            >
              <el-option label="所有方式" :value="''"></el-option>
              <template v-for="item in PurchaseType.TypeArray">
                <el-option
                  :key="item.KeyId"
                  v-if="item.KeyId != PurchaseType.WeiwStuff"
                  :label="item.Value"
                  :value="String(item.KeyId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              type="daterange"
              v-model="queryForm.ActualDate"
              value-format="yyyy-MM-dd"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
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
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        prop="IntakeCode"
        fixed
        label="来源编号"
        min-width="140"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="位置" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName}}</template>
      </el-table-column>
      <el-table-column prop="StuffType" label="类型" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{StuffType.Types[scope.row.StuffType]}}</template>
      </el-table-column>
      <el-table-column prop="PurchaseType" label="进货方式" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{PurchaseType.Types[scope.row.PurchaseType]}}</template>
      </el-table-column>
      <el-table-column prop="PreviousCode" label="订货单号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/rawMaterialOrder/viewMaterialOrder?id=${scope.row.PreviousId}`)"
          >{{scope.row.PreviousCode}}</span>
        </template>
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
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="重量" min-width="80" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{$root.toFloat(scope.row.Weight, 3)}}{{scope.row.StuffType === StuffType.Stone ? 'ct' : 'g'}}</template>
      </el-table-column>
      <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
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
            v-if="scope.row.State >= StuffIntakeOrderBasicState.Reject && scope.row.CheckNote"
          >
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(StuffIntakeOrderBasicState)"
            >{{StuffIntakeOrderBasicState.Types[scope.row.State] || '-'}}</span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(StuffIntakeOrderBasicState)"
            v-else
          >{{StuffIntakeOrderBasicState.Types[scope.row.State] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <router-link
            name="btnCheck"
            :to="{path:'/purchase/stockInventory/stockInventoryCheck',query:{id:scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnEdit"
            :to="{path:'/purchase/stockInventory/stockInventoryEdit',query:{id:scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
            v-if="scope.row.State == StuffIntakeOrderBasicState.Draft || scope.row.State == StuffIntakeOrderBasicState.Reject"
          >编辑</router-link>
          <el-button
            name="btnAudit"
            type="text"
            @click="audit(scope.row)"
            v-if="scope.row.State == StuffIntakeOrderBasicState.Wait"
          >审核</el-button>
          <el-button
            name="btnCancel"
            type="text"
            @click="cancelAudit(scope.row)"
            v-if="scope.row.State == StuffIntakeOrderBasicState.Audit"
          >取消审核</el-button>
          <el-button
            name="btnInvalid"
            type="text"
            @click="invalid(scope.row)"
            v-if="scope.row.State == StuffIntakeOrderBasicState.Draft || scope.row.State == StuffIntakeOrderBasicState.Reject"
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
            filterable
            name="ChargeUserId"
            v-model="createForm.ChargeUserId"
            @change="chargeUserChange"
          >
            <template v-for="item in $store.getters.users">
              <el-option
                :key="item.UserId"
                v-if="item.UserState === securityUserState.Audit"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="进货方式：" prop="PurchaseType">
          <el-radio-group name="PurchaseType" v-model="createForm.PurchaseType">
            <template v-for="item in PurchaseType.TypeArray">
              <el-radio
                :key="item.KeyId"
                :label="parseInt(item.KeyId)"
                v-if="item.KeyId != PurchaseType.WeiwStuff"
              >{{item.Value}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订货单号：" prop="PreviousCode">
          <el-input name="PreviousCode" v-model="createForm.PreviousCode" disabled :maxlength="50">
            <el-button
              name="btnSearch"
              slot="append"
              class="el-icon-more iconMores"
              @click="showMaterial"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="送货单号：" prop="ExpressCode">
          <el-input name="ExpressCode" v-model="createForm.ExpressCode" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="入库位置：" prop="WarehouseId" class="location">
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
          <el-radio :label="StuffIntakeOrderBasicState.Audit">审核通过</el-radio>
          <el-radio :label="StuffIntakeOrderBasicState.Reject">审核退回</el-radio>
          <el-input
            style="width:178px;"
            v-model="checkNote"
            :disabled="isCheck === StuffIntakeOrderBasicState.Audit"
            @keyup.enter="batchAudit"
            placeholder="退回原因备注"
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
      <el-form label-position="right" label-width="80px" :inline="true" :model="detailInfo">
        <el-form-item label="单据编号：">
          <span>{{detailInfo.IntakeCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detailInfo.CreateUser}}&nbsp;&nbsp;{{detailInfo.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="StuffIntakeOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="StuffIntakeOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === StuffIntakeOrderBasicState.Audit"
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
    <el-dialog
      v-if="materialVisible"
      title="选择订货单"
      :visible.sync="materialVisible"
      width="1000px"
      :before-close="materialClose"
    >
      <el-form
        :model="materialForm"
        label-width="100px"
        :inline="true"
        class="item-lh-26"
        ref="materialForm"
      >
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select
            filterable
            name="PartnerId"
            v-model="materialForm.PartnerId"
            placeholder="请选择"
            @change="selectOrderForm"
          >
            <el-option label="所有供应商" :value="0"></el-option>
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
        <el-form-item label="来源单号：" prop="PreviousCode">
          <el-input
            name="PreviousCode"
            v-model="materialForm.PurchaseCode"
            maxlength="30"
            @keyup.enter.native="selectOrderForm"
          >
            <el-button
              name="btnSearch"
              slot="append"
              class="el-icon-search"
              @click="selectOrderForm"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="materialData"
        @sort-change="materialSort"
        highlight-current-row
        @current-change="qualityCheckChange"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="PurchaseCode"
          fixed
          label="单据编号"
          min-width="140"
          show-overflow-tooltip
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{StuffType.Types[scope.row.StuffType]}}</template>
        </el-table-column>
        <el-table-column
          prop="ActualDate"
          label="业务日期"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
          prop="CreateTime"
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="采购员" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemWgt" label="重量" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.ItemWgt, 3)}}
          </template>
        </el-table-column>
        <el-table-column label="应付款" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
        <el-table-column
          label="预计到货日期"
          prop="ForwdDate"
          min-width="120"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.ForwdDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          label="最后操作时间"
          prop="CheckTime"
          min-width="120"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="materialConfirm"
          type="primary"
          :disabled="JSON.stringify(selectQualityCheck) === '{}'"
        >确定</el-button>
        <el-button @click="materialClose">取消</el-button>
      </span>
      <!-- Pagination -->
      <pagination
        :pg="materialParam.PageIndex"
        :size="materialParam.PageSize"
        :total="materialTotal"
        @currentChange="materialCurrentChange"
        @sizeChange="materialSizeChange"
      ></pagination>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  StuffIntakeOrderBasicState,
  StuffPurchaseOrderBasicState,
  FinanceType
} from '@/enums/stocking'
import { SecurityUserState } from '@/enums/merchant'
import { PurchaseType, StuffType, YNStatus, PartnerType } from '@/enums/common'
import {
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CREATE,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDITS,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDIT,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECTS,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECT,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_ABANDON,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CANCEL,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS
} from '@/apis/stocking'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      StuffIntakeOrderBasicState,
      PurchaseType,
      StuffType,
      YNStatus,
      FinanceType,
      securityUserState: SecurityUserState,
      partnerType: PartnerType,
      queryForm: {
        State: '',
        IntakeCode: '',
        Location: [''],
        StuffType: '',
        PurchaseType: '',
        PartnerId: '',
        CreateTime: '',
        ActualDate: '',
        ChargeUserId: '',
        CheckTime: '',
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
      wareHouses: [], // 所有仓库
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      createTitle: '新建',
      shelf: [],
      createForm: {
        PartnerId: '',
        StuffType: '',
        PreviousCode: '',
        ChargeUserId: '',
        ChargeUser: '',
        ExpressCode: '',
        Preprice: '',
        ActualDate: new Date().toJSON().substr(0, 10),
        PurchaseType: PurchaseType.Purchase,
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      createVisible: false, // 新建弹窗
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
          message: '请选择进货方式',
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
      parameters: {
        IntakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      detailInfo: {},
      checkNote: '',
      auditCheck: false, // 审核弹窗
      cancelCheck: false, // 取消/作废弹窗
      cancelName: 'cancel',
      stateCheck: 5, // 审核结果
      allCheck: false, // 批量审核
      isCheck: 5, // 批量审核结果
      materialVisible: false,
      materialForm: {
        PartnerId: 0,
        PurchaseCode: '',
        StuffType: 0,
        State: StuffPurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      materialParam: {},
      materialTotal: 0,
      materialData: [],
      selectQualityCheck: {} // 选择的原料订货单
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
      this.parameter.IntakeCode = query.IntakeCode || ''
      this.parameter.Location = Array.isArray(query.Location)
        ? query.Location[0]
          ? query.Location.map(item => parseInt(item))
          : ['']
        : query.Location
          ? [parseInt(query.Location)]
          : ['']
      this.parameter.StuffType = query.StuffType || ''
      this.parameter.PurchaseType = query.PurchaseType || ''
      this.parameter.PartnerId = query.PartnerId || ''
      this.parameter.ActualDate = query.ActualDate || []
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.ChargeUserId = query.ChargeUserId || ''
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
        ActualDate1: this.parameter.ActualDate[0],
        ActualDate2: this.parameter.ActualDate[1],
        CheckTime1: this.parameter.CheckTime[0],
        CheckTime2: this.parameter.CheckTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    createMaterial(command) {
      this.createTitle = `新建(${StuffType.Types[command]})`
      this.createForm.StuffType = command * 1
      this.createForm.ChargeUserId = this.$store.getters.user_session.UserId
      this.createForm.ChargeUser =
        this.$store.getters.user_session.TrueName ||
        this.$store.getters.user_session.AliasName
      this.createVisible = true
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
    chargeUserChange() {
      this.$store.getters.users.some(item => {
        if (item.UserId === this.createForm.ChargeUserId) {
          this.createForm.ChargeUser = item.TrueName || item.AliasName
        }
      })
    },
    handleClose() {
      this.$refs.createForm.resetFields()
      this.createVisible = false
    },
    // 新建选择订货单
    showMaterial() {
      this.materialVisible = true
      this.materialForm = {
        PartnerId: 0,
        PurchaseCode: '',
        StuffType: this.createForm.StuffType,
        State: StuffPurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      }
      this.materialParam = Object.assign({}, this.materialForm)
      this.getMaterialData()
    },
    selectOrderForm() {
      this.materialForm.PageIndex = 1
      this.materialParam = Object.assign({}, this.materialForm)
      this.selectQualityCheck = {}
      this.getMaterialData()
      console.log(JSON.stringify(this.selectQualityCheck) === '{}')
    },
    getMaterialData() {
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS(this.materialParam).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.materialData = res.data.Data.Rows || []
            this.materialTotal = res.data.Data.Count
          }
        }
      )
    },
    materialConfirm() {
      this.materialVisible = false
      this.createForm.PreviousCode = this.selectQualityCheck.PurchaseCode
      this.createForm.PreviousId = this.selectQualityCheck.PurchaseId
    },
    createList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CREATE({
            ...this.createForm,
            Preprice: this.$root.toInt(this.createForm.Preprice)
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.createVisible = false
              this.$refs['createForm'].resetFields()
              this.$router.push({
                path: '/purchase/stockInventory/stockInventoryEdit',
                query: { id: res.data.Data }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    qualityCheckChange(val) {
      this.selectQualityCheck = val || {}
    },
    materialClose() {
      this.materialVisible = false
      this.selectQualityCheck = {}
    },
    materialCurrentChange(val) {
      // 切换当前页
      this.materialParam.PageIndex = val
      this.getMaterialData()
    },
    materialSizeChange(val) {
      // 切换每页显示条数
      this.materialParam.PageSize = val
      this.materialParam.PageIndex = 1
      this.getMaterialData()
    },
    materialSort(sort) {
      // 表单排序
      switch (sort.prop) {
        case 'CreateTime':
          this.materialParam.OrderBy = 0
          break
        case 'PurchaseCode':
          this.materialParam.OrderBy = 1
          break
        case 'ActualDate':
          this.materialParam.OrderBy = 2
          break
        case 'ForwdDate':
          this.materialParam.OrderBy = 3
          break
        case 'CheckTime':
          this.materialParam.OrderBy = 4
          break
        default:
          this.materialParam.OrderBy = 0
          break
      }
      this.materialParam.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.selectOrderForm()
    },
    selectState() {
      this.parameter.PageIndex = 1
      this.initRoute()
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
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'IntakeCode':
          this.queryForm.OrderBy = 2
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
    audit(row) {
      // 审核弹窗
      this.auditCheck = true
      this.checkNote = ''
      this.stateCheck = StuffIntakeOrderBasicState.Audit
      this.detailInfo = row
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
          if (item.State !== this.StuffIntakeOrderBasicState.Wait) {
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
      if (this.isCheck === StuffIntakeOrderBasicState.Audit) {
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDITS({
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核成功')
            this.allCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECTS({
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
    isCancel() {
      // 取消、作废
      if (this.cancelName === 'cancel') {
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CANCEL({
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
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_ABANDON({
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
    isAudit() {
      // 审核、退回
      if (this.stateCheck === StuffIntakeOrderBasicState.Audit) {
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDIT({
          IntakeId: this.detailInfo.IntakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECT({
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
      this.$store.dispatch('GET_USERS_DROPLIST')
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
