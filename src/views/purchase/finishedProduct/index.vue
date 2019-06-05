<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" :disabled="newKind.length == 0 ? true : false" v-if="newKind.length <= 1" style="margin-right: 15px;" @click="newEndProduct(newKind[0].Id)">新建</el-button>
          <el-dropdown @command="newEndProduct" name="newEndProduct" v-if="newKind.length > 1" style="margin-right: 15px;">
            <el-button type="primary">
              新建
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item,index) in newKind">
              <el-dropdown-item
                v-if="item.State === YNStatus.Yes"
                :key="index"
                :command="item.Id"
                style="min-width: 80px; text-align: center;"
              >{{item.Value}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="showAuditDialog('批量审核')" name="btnMultiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="expandRows == 0">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="status" v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option
                v-for="item in orderBasicState.TypeArray"
                :key="item.value"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ArriveCode">
            <el-input
              name="ArriveCode"
              v-model="queryForm.ArriveCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button> 
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select filterable name="KindTypeEk" v-model="queryForm.KindTypeEk" placeholder="所有种类">
              <el-option label="所有种类" value="0"></el-option>
              <el-option
                v-for="(item,index) in kind"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有方式：" prop="PurchaseType">
            <el-select filterable name="PurchaseType" v-model="queryForm.PurchaseType" placeholder="所有方式">
              <el-option label="所有方式" value="0"></el-option>
              <el-option
                :label="purchaseType.Types[purchaseType.Purchase]"
                :value="String(purchaseType.Purchase)"
              ></el-option>
              <el-option
                :label="purchaseType.Types[purchaseType.WeiwStuff]"
                :value="String(purchaseType.WeiwStuff)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类别：" prop="FinanceType">
            <el-select filterable name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" value="0"></el-option>
              <el-option
                v-for="(item, index) in financeType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有入库情况：" prop="IntakeState">
            <el-select filterable name="IntakeState" v-model="queryForm.IntakeState" placeholder="所有入库情况">
              <el-option label="所有入库情况" value="0"></el-option>
              <el-option
                :label="IntakeState.Types[IntakeState.None]"
                :value="String(IntakeState.None)"
              ></el-option>
              <el-option
                :label="IntakeState.Types[IntakeState.Done]"
                :value="String(IntakeState.Done)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ArriveCode" label="单据编号：">
            <el-input
              name="ArriveCode"
              v-model="queryForm.ArriveCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="PartnerName" label="供应商：">
            <el-input
              name="PartnerName"
              v-model="queryForm.PartnerName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="PurchaseCode" label="订货单号：">
            <el-input
              name="PurchaseCode"
              v-model="queryForm.PurchaseCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="ExpressCode" label="送货单号：">
            <el-input
              name="ExpressCode"
              v-model="queryForm.ExpressCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              v-model="queryForm.ActualDate"
              @change="actualChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="采购员：" prop="ChargeUserId">
            <el-select filterable name="ChargeUserId" v-model="queryForm.ChargeUserId" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table
      :data="data"
      @sort-change="querySort"
      @selection-change="expandRow"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="ArriveCode"
        label="单据编号"
        sortable="custom"
        min-width="140"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="进货方式" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
      </el-table-column>
      <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
      </el-table-column>
      <el-table-column label="订货单号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/orderManagement/viewStyleOrder?id=${scope.row.PurchaseId}`)"
          >{{scope.row.PurchaseCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ExpressCode" label="送货单号" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="业务日期"
        sortable="custom"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        sortable="custom"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ArriveQty" label="到货数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="金重" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}</template>
      </el-table-column>
      <el-table-column label="标签价" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.LabelPrice)}}</template>
      </el-table-column>
      <el-table-column label="成本" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.CostPrice)}}</template>
      </el-table-column>
      <el-table-column label="应付款" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
      </el-table-column>
      <!-- <el-table-column prop="QualityNote" label="检验情况" min-width="80" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="入库情况" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.State === orderBasicState.Draft || scope.row.State === orderBasicState.Wait">
            -
          </div>
          <div v-else>
            {{IntakeState.Types[scope.row.IntakeState]}}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="入库数量" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.State === orderBasicState.Draft || scope.row.State === orderBasicState.Wait">
            -
          </div>
          <div v-else>{{scope.row.IntakeQty}}</div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="CheckTime"
        label="最后操作时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip placement="top" v-if="(scope.row.State === orderBasicState.Reject || scope.row.State === orderBasicState.Abandon || scope.row.State === orderBasicState.Cancel) && scope.row.CheckNote">
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(orderBasicState)">
              {{orderBasicState.Types[scope.row.State] || '-'}}
            </span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(orderBasicState)"
            v-else>
            {{orderBasicState.Types[scope.row.State] || '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            name="btnShowDetail"
            type="text"
            @click="viewArrivalOrder(scope.row.ArriveId)"
          >查看</el-button>
          <el-button
            name="btnShowDetail"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            type="text"
            @click="toLinkEdit(scope.row.ArriveId)"
          >编辑</el-button>
          <el-button
            name="btnShowDetail"
            v-if="orderBasicState.Wait == scope.row.State"
            type="text"
            @click="showAuditDialog('审核', scope.row)"
          >审核</el-button>
          <el-button
            name="btnShowDetail"
            v-if="orderBasicState.Audit == scope.row.State"
            type="text"
            @click="openCancelReview(scope.row)"
          >取消审核</el-button>
          <el-button
            name="btnShowDetail"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            type="text"
            @click="openObsolete(scope.row)"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <el-dialog
      v-if="newVisible"
      title="新建成品到货单"
      :visible.sync="newVisible"
      width="600px"
      :before-close="newOrderDialogColse"
    >
      <el-form
        :model="newPurchaseOrder"
        :rules="newOrderRules"
        ref="newOrder"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
        <div>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select filterable name="PartnerId" v-model="newPurchaseOrder.PartnerId" placeholder="请选择">
              <template v-for="(item,index) in supplierList">
                <el-option
                  v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                  :key="index"
                  :label="item.Value"
                  :value="String(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="采购员：" prop="ChargeUserId">
            <el-select
              filterable
              name="ChargeUserId"
              v-model="newPurchaseOrder.ChargeUserId"
              placeholder="请选择"
              @change="ChargeUserChange"
            >
              <template v-for="(item, index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="进货方式：" prop="PurchaseType">
            <el-radio-group v-model="newPurchaseOrder.PurchaseType" @change="purchaseTypeChange">
              <el-radio
                :label="Number(purchaseType.Purchase)"
              >{{purchaseType.Types[purchaseType.Purchase]}}</el-radio>
              <el-radio
                :label="Number(purchaseType.WeiwStuff)"
              >{{purchaseType.Types[purchaseType.WeiwStuff]}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="货品类别：" prop="FinanceType">
            <el-radio-group v-model="newPurchaseOrder.FinanceType">
              <el-radio
                v-for="(item, index) in financeType.TypeArray"
                :key="index"
                :label="item.KeyId"
                :disabled="newPurchaseOrder.PurchaseType != purchaseType.Purchase ? item.KeyId == financeType.Take ? true : false : false"
              >{{item.Value}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="PurchaseCode" label="订货单号：">
            <el-row>
              <el-col :span="20">
                <el-input
                  name="PurchaseCode"
                  v-model="newPurchaseOrder.PurchaseCode"
                  disabled
                  :maxlength="50"
                >
                  <el-button name="btnSearch" slot="append" class="el-icon-more iconMores" @click="selectOrderForm"></el-button> 
                </el-input>
              </el-col>
              <!-- <el-col :span="4">
                <div style="padding: 0 10px; cursor: pointer;" @click="selectOrderForm">
                  <i class="el-icon-more"></i>
                </div>
              </el-col> -->
            </el-row>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="ExpressCode" label="送货单号：">
            <el-input name="ExpressCode" v-model="newPurchaseOrder.ExpressCode" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              :clearable="false"
              type="date"
              placeholder="选择日期"
              v-model="newPurchaseOrder.ActualDate"
              style="width: 100%;"
              :picker-options="$store.getters.businessDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="Preprice" label="应付款：">
            <el-input
              name="Preprice"
              v-model="newPurchaseOrder.Preprice"
              @keyup.native="newPurchaseOrder.Preprice = $root.toFixed(newPurchaseOrder.Preprice, 2, true)"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" :maxlength="200" v-model="newPurchaseOrder.Note" style="width: 300px"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 审核 -->
    <review-Dialog
      :auditDialog="auditDialog"
      :title="reviewTitle"
      :data="reviewData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 质检单 -->
    <el-dialog
      v-if="arrivalVisible"
      title="选择订货单"
      :visible.sync="arrivalVisible"
      width="1000px"
      :before-close="arrivalClose"
    >
      <el-form
        :model="arrivalOrderForm"
        ref="arrivalSearch"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select
            filterable
            name="PartnerId"
            v-model="arrivalOrderForm.PartnerId"
            placeholder="请选择"
            @change="getQualityCheck"
          >
            <el-option label="所有供应商" value="0"></el-option>
            <template v-for="(item,index) in supplierList">
              <el-option
                v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="来源单号：" prop="PreviousCode">
            <el-input name="PreviousCode" v-model="arrivalOrderForm.PurchaseCode" maxlength="30" @keyup.enter.native="getQualityCheck">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getQualityCheck"></el-button>
            </el-input>
          </el-form-item>
      </el-form>
      <el-table
        :data="arrivalOrderData"
        @sort-change="arrivalSort"
        highlight-current-row
        @current-change="qualityCheckChange"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="PurchaseCode"
          label="单据编号"
          sortable="custom"
          min-width="140"
          show-overflow-tooltip
          fixed
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
        </el-table-column>
        <!-- <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column> -->
        <el-table-column label="货品种类" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.KindTypeEv}}</template>
        </el-table-column>
        <el-table-column
          label="业务日期"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="ItemQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="CostPrice" label="成本" min-width="80" show-overflow-tooltip>
           <template slot-scope="scope">{{$root.toFloat(scope.row.CostPrice)}}</template>
        </el-table-column> -->
        <el-table-column prop="Preprice" label="应付款" min-width="80" show-overflow-tooltip>
           <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arrivalConfirm" type="primary" :disabled="selectQualityCheck.PurchaseId ? false : true" >确 定</el-button>
        <el-button @click="arrivalClose">取 消</el-button>
      </span>
      <!-- Pagination -->
      <pagination
        :pg="arrivalOrderForm.PageIndex"
        :size="arrivalOrderForm.PageSize"
        :total="arrivalTotal"
        @currentChange="arrivalCurrentChange"
        @sizeChange="arrivalSizeChange"
      ></pagination>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  GoodsArriveOrderBasicState,
  SettingEnumeratorEnumeratorType,
  FinanceType,
  GoodsArriveOrderBasicIntakeState,
  StylePurchaseOrderBasicState
} from '@/enums/stocking.js'
import { PurchaseType, CharacterType, YNStatus, PartnerType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDITS,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECTS,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CANCEL,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST
} from '@/apis/merchant.js'
import { SecurityUserState } from '@/enums/merchant.js'
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
export default {
  data() {
    return {
      SecurityUserState,
      partnerType: PartnerType,
      YNStatus,
      characterType: CharacterType,
      orderBasicState: GoodsArriveOrderBasicState, // 入库状态
      newKind: [],
      purchaseType: PurchaseType, // 进货方式拉下
      financeType: FinanceType, // 货品类别
      IntakeState: GoodsArriveOrderBasicIntakeState, // 入库情况下拉
      kind: [], // 种类
      buyerList: [], // 采购员下拉
      supplierList: [], // 供应商下拉
      queryForm: {
        // 查询表单数据
        State: '0',
        KindTypeEk: '0',
        PurchaseType: '0',
        FinanceType: '0',
        IntakeState: '0',
        ArriveCode: '',
        PartnerName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        PurchaseCode: '',
        ExpressCode: '',
        ActualDate: [],
        ActualDate1: '',
        ActualDate2: '',
        ChargeUserId: '0',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      newVisible: false, // 新建弹窗
      auditDialog: false, // 审核弹窗
      arrivalVisible: false, // 到货入库弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      newPurchaseOrder: {
        KindTypeEk: '',
        KindTypeEv: '',
        PurchaseCode: '',
        PurchaseId: 0,
        ChargeUserId: '',
        ChargeUser: '',
        PurchaseType: PurchaseType.Purchase,
        FinanceType: FinanceType.TypeArray[0].KeyId,
        PreviousId: '',
        ExpressCode: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        Preprice: '',
        Note: ''
      }, // 新建成品入库单
      Position: [], // 位置筛选
      expandRows: [],
      parameters: {},
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 审核数据
      newOrderRules: {
        PartnerId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        ChargeUserId: [
          { required: true, message: '请选择采购员', trigger: 'change' }
        ],
        PurchaseType: [
          { required: true, message: '请选择进货方式', trigger: 'change' }
        ],
        FinanceType: [
          { required: true, message: '请选择货品类别', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
      },
      arrivalOrderForm: {
        State: StylePurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PartnerId: '0',
        PurchaseCode: '',
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      arrivalOrderData: [],
      arrivalTotal: 0, // 质检单总数
      selectQualityCheck: {}, // 选中质检单
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            State: '0',
            KindTypeEk: '0',
            PurchaseType: '0',
            FinanceType: '0',
            IntakeState: '0',
            ArriveCode: '',
            PartnerName: '',
            CreateTime1: '',
            CreateTime2: '',
            PurchaseCode: '',
            ExpressCode: '',
            ActualDate1: '',
            ActualDate2: '',
            ChargeUserId: '0',
            CheckTime1: '',
            CheckTime2: '',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    createChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    actualChange(value) {
      if (value) {
        this.queryForm.ActualDate1 = value[0]
        this.queryForm.ActualDate2 = value[1]
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate2 = ''
      }
    },
    checkChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(val) {
      this.expandRows = val
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'ActualDate':
          this.queryForm.OrderBy = 2
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'ArriveCode':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm.ActualDate1 = ''
      this.queryForm.ActualDate2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
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
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    
    initRoute() {
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
          this.newKind = res.data.Data.Rows.filter(item => item.State === YNStatus.Yes)
        }
      })
    },
    // 获取采购员
    getBuyerList() {
      MERCHANT_API_DROPDOWN_USERLIST({
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    // 打开新建弹窗
    newEndProduct(command) {
      this.newPurchaseOrder.KindTypeEk = command
      this.kind.map(item => {
        if (item.Id == command) {
          this.newPurchaseOrder.KindTypeEv = item.Value
        }
      })
      this.newVisible = true
    },
    // 打开审核和批量审核弹窗
    showAuditDialog(title, obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.ArriveCode }] : []
      this.reviewTitle = title || ''
      if(title === '批量审核') {
        if (this.expandRows.filter(item => {
          if (item.State !== this.orderBasicState.Wait) {
            return item
          }
        }).length > 0) {
          return this.$message.error('请选择待审核的单据')
        }
      }
      this.auditDialog = true
    },
    // 查看
    viewArrivalOrder(id) {
      console.log(id)
      this.$router.push(
        `/purchase/finishedProduct/viewFinishedProductOrder?id=${id}`
      )
    },
    // 编辑
    toLinkEdit(id) {
      this.$router.push(
        `/purchase/finishedProduct/editFinishedProductOrder?id=${id}`
      )
    },
    // 打开作废
    openObsolete(obj) {
      this.reviewData = [{ ...obj, orderNumber: obj.ArriveCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ArriveId: this.reviewData[0].ArriveId,
        CheckNote: note
      }
      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.ArriveCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        ArriveId: Number(this.reviewData[0].ArriveId),
        CheckNote: data
      }

      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.reviewData = []
      this.visibleCan = false
    },
    // 新建弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newPurchaseOrder,
            PartnerId: Number(this.newPurchaseOrder.PartnerId),
            ChargeUserId: Number(this.newPurchaseOrder.ChargeUserId),
            PreviousId: Number(this.newPurchaseOrder.PreviousId),
            PurchaseType: Number(this.newPurchaseOrder.PurchaseType),
            Preprice: this.$root.toInt(this.newPurchaseOrder.Preprice),
            PurchaseId: Number(this.newPurchaseOrder.PurchaseId)
          }
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.newVisible = false
              setTimeout(() => {
                this.toLinkEdit(res.data.Data)
              }, 500)
              
            }
          })
        }
      })
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.newVisible = false
    },
    // 新建采购员
    ChargeUserChange() {
      this.buyerList.map(item => {
        if (item.UserId == this.newPurchaseOrder.ChargeUserId) {
          this.newPurchaseOrder.ChargeUser = item.TrueName
        }
      })
    },
    // 新建进货方式发生变化
    purchaseTypeChange() {
      if (this.newPurchaseOrder.PurchaseType != PurchaseType.Purchase) {
        this.newPurchaseOrder.FinanceType = FinanceType.TypeArray[0].KeyId
      }
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          ArriveId: Number(this.reviewData[0].ArriveId),
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDIT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核通过成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核退回成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      } else if (this.reviewTitle == '批量审核') {
        if (this.expandRows.some((res) =>{
          return res.State != this.orderBasicState.Wait
        })) {
          this.$store.commit('SET_BTN_LOADING', false)
          this.$message.error('请选择待审核的成品到货单!')
          return false
        }
        const para = {
          Items: [],
          CheckNote: data.auditReson
        }
        this.expandRows.map(item => {
          if(item.State === GoodsArriveOrderBasicState.Wait) {
            const obj = {
              ArriveId: item.ArriveId
            }
            para.Items.push(obj)
          }
        })
        if(para.Items.length === 0) {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('请选择待审核的单据')
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDITS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核通过成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECTS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核退回成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      }
    },
    cancelAudit(data) {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = data
    },
    // 新建选择订货单
    selectOrderForm() {
      this.arrivalVisible = true
      this.arrivalOrderForm.KindTypeEk = this.newPurchaseOrder.KindTypeEk
      this.getQualityCheck()
    },
    // 获取质检单数据
    getQualityCheck() {
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS(this.arrivalOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.arrivalOrderData = res.data.Data.Rows || []
            this.arrivalTotal = res.data.Data.Count || 0
          }
        }
      )
    },
    arrivalCurrentChange(val) {
      // 切换当前页
      this.arrivalOrderForm.PageIndex = val
      this.getQualityCheck()
    },
    arrivalSizeChange(val) {
      // 切换每页显示条数
      this.arrivalOrderForm.PageSize = val
      this.arrivalOrderForm.PageIndex = 1
      this.getQualityCheck()
    },
    arrivalClose() {
      this.selectQualityCheck = {}
      this.arrivalVisible = false
      this.arrivalOrderForm = {
        KindTypeEk: 0,
        State: StylePurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PartnerId: '0',
        PurchaseCode: '',
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      this.$refs['arrivalSearch'].resetFields()
    },
    arrivalConfirm() {
      this.arrivalVisible = false
      this.newPurchaseOrder.PurchaseCode = this.selectQualityCheck.PurchaseCode
      this.newPurchaseOrder.PurchaseId = this.selectQualityCheck.PurchaseId
    },
    // 选择质检单
    qualityCheckChange(val) {
      this.selectQualityCheck = val
    },
    // 质检单排序
    arrivalSort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.arrivalOrderForm.OrderBy = 0
          break
        case 'SplitCode':
          this.arrivalOrderForm.OrderBy = 2
          break
        case 'ItemQty':
          this.arrivalOrderForm.OrderBy = 4
          break
        case 'CheckTime':
          this.arrivalOrderForm.OrderBy = 1
          break
        default:
          this.arrivalOrderForm.OrderBy = 0
          break
      }
      this.arrivalOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getQualityCheck()
    },
  },
  created() {},
  mounted() {
    this.getKind()
    this.getBuyerList()
    this.getSupplierList()
    this.init()
    this.newPurchaseOrder.ChargeUserId = String(JSON.parse(decodeURIComponent(`${localStorage.getItem('userInfo')}`)).UserId)
    this.newPurchaseOrder.ChargeUser = JSON.parse(decodeURIComponent(`${localStorage.getItem('userInfo')}`)).TrueName
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
  },
  components: {
    searchPanel,
    pagination,
    reviewDialog,
    obsolete,
    cancelReview
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;
}
.iconMores {
  background-color: #fff !important;
  width: 32px;
  border: 1px solid #DCDFE6 !important;
  padding: 7px;
}
</style>
