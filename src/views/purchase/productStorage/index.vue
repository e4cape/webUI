<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" :disabled="newKind.length == 0 ? true : false" v-if="newKind.length <= 1" @click="newEndProduct(newKind[0].Id)">新建</el-button>
          <el-dropdown @command="newEndProduct" name="newEndProduct" style="margin-right: 10px;" v-if="newKind.length > 1">
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
          <el-button
            type="primary"
            @click="arrivalDialog('到货入库', qualityType.GoodsArriveOrderBasic)"
            name="btnArrival"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >到货入库</el-button>
          <el-button
            type="primary"
            @click="arrivalDialog('分秤入库', qualityType.HalfChangeOrderBasic)"
            name="btnScale"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >分秤入库</el-button>
          <el-button
            type="primary"
            @click="arrivalDialog('旧货转成品入库', qualityType.JunkChangeOrderBasic)"
            name="btnJunk"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >旧货转成品入库</el-button>
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
          <el-form-item prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button> 
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="种类：" prop="KindTypeEk">
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
          <el-form-item label="位置：" v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-cascader
              v-model="Position"
              :options="positionList"
              change-on-select
              @visible-change="cascaderChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所有方式：" prop="PurchaseType">
            <el-select filterable name="PurchaseType" v-model="queryForm.PurchaseType" placeholder="所有方式">
              <el-option label="所有方式" value="0"></el-option>
              <template v-for="(item, index) in purchaseType.TypeArray">
                <el-option
                  v-if="item.KeyId < purchaseType.WeiwGoods"
                  :key="index"
                  :label="item.Value"
                  :value="String(item.KeyId)"
                ></el-option>
              </template>
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
          <el-form-item
            label="所有来源："
            prop="IntakeType"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >
            <el-select filterable name="IntakeType" v-model="queryForm.IntakeType" placeholder="所有来源">
              <el-option label="所有来源" value="0"></el-option>
              <el-option
                v-for="(item, index) in orderBasicIntakeType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="IntakeCode" label="单据编号：">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
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
          <el-form-item prop="PreviousCode" label="来源单号：" v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-input
              name="PreviousCode"
              v-model="queryForm.PreviousCode"
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
      tooltip-effect="dark"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="IntakeCode"
        label="单据编号"
        sortable="custom"
        min-width="140"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="进货方式"
        v-if="$store.getters.user_session.CharacterType === characterType.Company"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
      </el-table-column>
      <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
      </el-table-column>
      <el-table-column
        label="来源"
        v-if="$store.getters.user_session.CharacterType === characterType.Company"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{orderBasicIntakeType.Types[scope.row.IntakeType]}}</template>
      </el-table-column>
      <el-table-column
        prop="PreviousCode"
        label="来源单号"
        v-if="$store.getters.user_session.CharacterType === characterType.Company"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            v-if="orderBasicIntakeType.GoodsArriveOrderBasic == scope.row.IntakeType"
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/finishedProduct/viewFinishedProductOrder?id=${scope.row.PreviousId2}`)"
          >
            {{scope.row.PreviousCode2}}
          </span>
          <span
            v-else-if="orderBasicIntakeType.JunkChangeOrderBasic == scope.row.IntakeType"
            class="btn-link el-button--text"
            @click="$router.push(`/depot/junkChange/check?id=${scope.row.PreviousId2}`)"
            style="cursor: pointer;"
          >
            {{scope.row.PreviousCode2}}
          </span>
          <span
            v-else-if="orderBasicIntakeType.HalfChangeOrderBasic == scope.row.IntakeType"
            class="btn-link el-button--text"
            @click="$router.push(`/purchase/pointsBalance/pointsBalanceCheck?id=${scope.row.PreviousId2}`)"
            style="cursor: pointer;"
          >
            {{scope.row.PreviousCode2}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="WarehouseName"
        label="入库位置"
        v-if="$store.getters.user_session.CharacterType === characterType.Company"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="业务日期" sortable="custom" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="IntakeQty" label="货品数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
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
      <el-table-column label="最后操作时间" min-width="120" sortable="custom" show-overflow-tooltip>
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
            @click="viewArrivalOrder(scope.row.IntakeId)"
          >查看</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="linkEditPage(scope.row.IntakeId)"
          >编辑</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="openObsolete(scope.row)"
          >作废</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Wait == scope.row.State"
            @click="showAuditDialog('审核',scope.row)"
          >审核</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Audit == scope.row.State"
            @click="openCancelReview(scope.row)"
          >取消审核</el-button>
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
      :title="newOrderTitle"
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
              <template v-for="(item, index) in supplierList">
                <el-option
                  v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
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
                  :value="Number(item.UserId)"
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
        <!-- <div>
          <el-form-item prop="PreviousId" label="订货单号：">
            <el-row>
              <el-col :span="20">
                <el-input
                  name="PreviousId"
                  v-model="newPurchaseOrder.PreviousId"
                  disabled
                  :maxlength="50"
                >
                  <el-button name="btnSearch" slot="append" class="el-icon-more iconMores" @click="selectOrderForm"></el-button> 
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </div> -->
        <div>
          <el-form-item prop="ExpressCode" label="送货单号：">
            <el-input name="ExpressCode" v-model="newPurchaseOrder.ExpressCode" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-form-item label="入库位置：" prop="WarehouseId">
              <el-select filterable v-model="newPurchaseOrder.WarehouseId" @change="warehouseChange">
                <template v-for="(item, index) in newPositionList">
                  <el-option
                    v-if="item.State === YNStatus.Yes"
                    :key="index"
                    :label="item.label"
                    :value="String(item.Id)"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId">
              <el-select filterable v-model="newPurchaseOrder.ShelfId" :disabled="shelfList.length == 0">
                <el-option
                  v-for="(item, index) in shelfList"
                  :key="index"
                  :label="item.Value"
                  :value="String(item.Id)"
                ></el-option>
              </el-select>
            </el-form-item>
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
            <el-input type="textarea" @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" v-model="newPurchaseOrder.Note" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 质检单 -->
    <el-dialog
      v-if="arrivalVisible"
      :title="arrivalTitle"
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
        <el-form-item prop="PartnerId" v-if="arrivalTitle !== '旧货转成品入库'">
          <el-select filterable name="PartnerId" v-model="arrivalOrderForm.PartnerId" placeholder="请选择" @change="getQualityCheck">
            <el-option label="所有供应商" value="0"></el-option>
            <template v-for="(item, index) in supplierList">
              <el-option
                v-if="item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier"
                :key="index"
                :label="item.Value"
                :value="Number(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="KindTypeEk" v-if="arrivalTitle === '到货入库'">
          <el-select filterable name="KindTypeEk" v-model="arrivalOrderForm.KindTypeEk" placeholder="请选择" @change="getQualityCheck">
            <el-option label="所有种类" value="0"></el-option>
            <el-option
              v-for="(item,index) in kind"
              :key="index"
              :label="item.Value"
              :value="String(item.Id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="QualityCode">
          <el-input
            name="QualityCode"
            v-model="arrivalOrderForm.QualityCode"
            placeholder="请输入单据编号"
            :maxlength="50"
            @keyup.enter.native="getQualityCheck"
          >
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
          prop="QualityCode"
          label="单据编号"
          sortable="custom"
          min-width="140"
          show-overflow-tooltip
          fixed
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip v-if="arrivalTitle !== '旧货转成品入库'"></el-table-column>
        <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式" min-width="100" show-overflow-tooltip v-if="arrivalTitle === '到货入库'">
          <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
        </el-table-column>
        <el-table-column label="货品类别" min-width="80" show-overflow-tooltip v-if="arrivalTitle === '到货入库'">
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column>
        <!-- <el-table-column label="旧货位置" min-width="80" show-overflow-tooltip v-if="arrivalTitle === '旧货转成品入库'">
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column>
        <el-table-column label="转换原因" min-width="80" show-overflow-tooltip v-if="arrivalTitle === '旧货转成品入库'">
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column> -->
        <el-table-column
          prop="ActualDate"
          label="业务日期"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
          v-if="arrivalTitle !== '旧货转成品入库'"
        >
          <template slot-scope="scope">{{ scope.row.ActualDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="ArriveQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
         <el-table-column prop="GoldWeight" label="重量" min-width="80" show-overflow-tooltip v-if="arrivalTitle == '分秤入库'">
           <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight,3)}}</template>
         </el-table-column>
        <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip v-else>
          <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight,3)}}</template>
        </el-table-column>
        <el-table-column prop="LabelPrice" label="标签价" min-width="80" show-overflow-tooltip v-if="arrivalTitle !== '旧货转成品入库'">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.LabelPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="CostPrice" label="成本" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.CostPrice)}}</template>
        </el-table-column>
        <el-table-column prop="Preprice" label="应付款" min-width="80" show-overflow-tooltip v-if="arrivalTitle !== '旧货转成品入库'">
          <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="selectQualityCheck.QualityId ? false : true" @click="arrivalConfirm" v-if="arrivalTitle === '新建成品入库单'">确 定</el-button>
        <el-button
          type="primary"
          @click="nextStep"
          :disabled="selectQualityCheck.QualityId ? false : true"
          v-if="arrivalTitle === '到货入库' || arrivalTitle === '分秤入库' || arrivalTitle === '旧货转成品入库'"
        >下一步</el-button>
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
    <!-- 审核 -->
    <review-Dialog
      v-if="auditDialog"
      :auditDialog="auditDialog"
      :title="reviewTitle"
      :data="reviewData"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
  </el-row>
</template>

<script>
import {
  GoodsIntakeOrderBasicState,
  SettingEnumeratorEnumeratorType,
  FinanceType,
  GoodsIntakeOrderBasicIntakeType,
  GoodsQualityOrderBasicQualityType,
  GoodsQualityOrderBasicState,
  GoodsQualityOrderBasicIntakeState,
} from '@/enums/stocking.js'
import { PurchaseType, CharacterType, YNStatus, PartnerType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDITS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECTS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
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
      YNStatus: YNStatus,
      partnerType: PartnerType,
      characterType: CharacterType,
      orderBasicState: GoodsIntakeOrderBasicState, // 入库状态
      purchaseType: PurchaseType, // 进货方式拉下
      financeType: FinanceType, // 货品类别
      qualityType: GoodsQualityOrderBasicQualityType,
      orderBasicIntakeType: GoodsIntakeOrderBasicIntakeType, // 来源拉下
      kind: [], // 种类
      newKind: [],
      buyerList: [], // 采购员下拉
      positionList: [{
        label: '所有位置',
        value: 0
      }], // 位置仓库下拉
      newPositionList: [],
      shelfList: [], // 货架下拉
      supplierList: [], // 供应商下拉
      queryForm: {
        // 查询表单数据
        WarehouseId: '',
        ShelfId: '',
        KindTypeEk: '0',
        PurchaseType: '0',
        FinanceType: '0',
        IntakeType: '0',
        IntakeCode: '',
        PartnerName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        PreviousCode: '',
        ExpressCode: '',
        ChargeUserId: '0',
        ActualDate: [],
        ActualDate1: '',
        ActualDate2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      arrivalOrderForm: {
        PreviousCode: '',
        PartnerId: '0',
        KindTypeEk: '0',
        QualityType: 0,
        IntakeState: GoodsQualityOrderBasicIntakeState.None,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20,
        State: GoodsQualityOrderBasicState.Qualitied
      }, // 质检单筛选
      arrivalOrderData: [], // 质检单数据
      arrivalTotal: 0, // 质检单总数
      selectQualityCheck: {}, // 选中质检单
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
        PartnerId: '',
        ChargeUserId: '',
        ChargeUser: '',
        PurchaseType: PurchaseType.Purchase,
        FinanceType: FinanceType.TypeArray[0].KeyId,
        PreviousId: '',
        ExpressCode: '',
        WarehouseId: '',
        ShelfId: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        Preprice: '',
        Note: ''
      }, // 新建成品入库单
      Position: [0], // 位置筛选
      expandRows: [],
      parameters: {},
      newOrderTitle: '', // 入库弹窗标题  "新建成品入库单、到货入库、分秤入库、旧货转成品入库"
      arrivalTitle: '', // 质检单弹窗标题 "新建成品入库单 到货入库、分秤入库、旧货转成品入库"
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 弹窗数据
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
        WarehouseId: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        ShelfId: [{ required: true, message: '请选择货架', trigger: 'change' }],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        ExpressCode: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if(value.replace(/^[0-9a-zA-Z]*$/g,'')) {
                callback(new Error('只能输入数字和字母'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      ChargeUserId: null,
      ChargeUser: '',
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            WarehouseId: '',
            ShelfId: '',
            KindTypeEk: '0',
            PurchaseType: '0',
            FinanceType: '0',
            IntakeType: '0',
            IntakeCode: '',
            PartnerName: '',
            CreateTime1: '',
            CreateTime2: '',
            PreviousCode: '',
            ExpressCode: '',
            ChargeUserId: '0',
            ActualDate1: '',
            ActualDate2: '',
            CheckTime1: '',
            CheckTime2: '',
            State: '0',
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
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS(this.queryForm).then(res => {
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
        case 'IntakeId':
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
      // 重置表单
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.ActualDate1 = ''
      this.queryForm.ActualDate2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      this.queryForm.WarehouseId = ''
      this.queryForm.ShelfId = ''
      this.Position = [0]
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
    arrivalCurrentChange(val) {
      // 切换当前页
      this.arrivalOrderForm.PageIndex = val
      this.initRoute()
    },
    arrivalSizeChange(val) {
      // 切换每页显示条数
      this.arrivalOrderForm.PageSize = val
      this.arrivalOrderForm.PageIndex = 1
    },
    initRoute() {
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    // 查看到货单
    viewArrivalOrder(id) {
      this.$router.push({
        path: '/purchase/productStorage/viewProductStorage',
        query: { id }
      })
    },
    // 跳转编辑
    linkEditPage(id) {
      this.$router.push({
        path: '/purchase/productStorage/editProductStorage',
        query: { id }
      })
    },
    // 位置筛选
    cascaderChange(value) {
      if (!value) {
        this.queryForm.WarehouseId = this.Position.length
          ? this.Position[0]
          : ''
        this.queryForm.ShelfId =
          this.Position.length >= 2 ? this.Position[1] : ''
      }
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
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    // 获取入库位置
    getPositionList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.Yes }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            res.data.Data.Rows.map(item => {
              const obj = {
                ...item,
                label: item.Value,
                value: item.Id
              }
              if (obj.Childrens.length && obj.Childrens.length != 1) {
                obj.children = item.Childrens.map(val => {
                  return {
                    ...val,
                    label: val.Value,
                    value: val.Id
                  }
                })
              }
              this.positionList.push(obj)
              this.newPositionList.push(obj)
            })
          }
        }
      )
    },
    // 打开新建弹窗
    newEndProduct(command) {
      this.newOrderTitle = '新建成品入库单'
      this.newPurchaseOrder.KindTypeEk = command
      this.newPurchaseOrder.ChargeUserId = this.ChargeUserId
      this.newPurchaseOrder.ChargeUser = this.ChargeUser
      this.kind.map(item => {
        if (item.Id == command) {
          this.newPurchaseOrder.KindTypeEv = item.Value
        }
      })
      this.newVisible = true
    },
    // 打开审核和批量审核弹窗
    showAuditDialog(title, obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.IntakeCode }] : []
      this.reviewTitle = title || ''
      this.auditDialog = true
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开作废
    openObsolete(obj) {
      this.reviewData = [{ ...obj, orderNumber: obj.IntakeCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        IntakeId: this.reviewData[0].IntakeId,
        CheckNote: note
      }
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_ABANDON(para).then(res => {
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
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.IntakeCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        IntakeId: Number(this.reviewData[0].IntakeId),
        CheckNote: data
      }

      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CANCEL(para).then(res => {
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
            PreviousId: this.selectQualityCheck.QualityId
              ? this.selectQualityCheck.QualityId
              : Number(this.newPurchaseOrder.PreviousId),
            WarehouseId: Number(this.newPurchaseOrder.WarehouseId),
            ShelfId: Number(this.newPurchaseOrder.ShelfId),
            PurchaseType: Number(this.newPurchaseOrder.PurchaseType),
            ActualDate: dayjs(this.newPurchaseOrder.ActualDate).format(
              'YYYY-MM-DD'
            ),
            Preprice: this.$root.toInt(this.newPurchaseOrder.Preprice)
          }
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.selectQualityCheck = {}
              this.newVisible = false
              setTimeout(() => {
                this.linkEditPage(res.data.Data)
              }, 500)
            }
          })
        }
      })
    },
    // 新建选择订货单
    selectOrderForm() {
      this.arrivalTitle = this.newOrderTitle
      this.arrivalVisible = true
      this.getQualityCheck()
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.selectQualityCheck = {}
      this.newPurchaseOrder = {
        KindTypeEk: '',
        KindTypeEv: '',
        PartnerId: '',
        ChargeUserId: '',
        ChargeUser: '',
        PurchaseType: PurchaseType.Purchase,
        FinanceType: FinanceType.TypeArray[0].KeyId,
        PreviousId: '',
        ExpressCode: '',
        WarehouseId: '',
        ShelfId: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        Preprice: '',
        Note: ''
      },
      this.shelfList = []
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
    // 新建进货单选择仓库后
    warehouseChange() {
      const Shelf = this.positionList.find(item => {
        return item.Id == this.newPurchaseOrder.WarehouseId
      })
      this.newPurchaseOrder.ShelfId =
        Shelf.Childrens.length == 1 ? String(Shelf.Childrens[0].Id) : ''
      this.shelfList = Shelf.Childrens
    },
    // 打开质检单弹窗
    arrivalDialog(title, id) {
      this.arrivalVisible = true
      this.arrivalTitle = title
      this.arrivalOrderForm.QualityType = id
      // if(title == '到货入库' || title == '旧货转成品入库') {
      //   this.arrivalOrderForm['IntakeState'] = GoodsQualityOrderBasicIntakeState.None
      // } else {
      //   delete this.arrivalOrderForm['IntakeState']
      // }
      this.getQualityCheck()
    },
    // 获取质检单数据
    getQualityCheck() {
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS(this.arrivalOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.arrivalOrderData = res.data.Data.Rows || []
            this.arrivalTotal = res.data.Data.Count || 0
          }
        }
      )
    },
    // 质检单排序
    arrivalSort(sort) {
      switch (sort.prop) {
        case 'ActualDate':
          this.arrivalOrderForm.OrderBy = 2
          break
        case 'CreateTime':
          this.arrivalOrderForm.OrderBy = 0
          break
        case 'CheckTime':
          this.arrivalOrderForm.OrderBy = 1
          break
        case 'IntakeId':
          this.arrivalOrderForm.OrderBy = 3
          break
        default:
          this.arrivalOrderForm.OrderBy = 0
          break
      }
      this.arrivalOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getQualityCheck()
    },
    // 选择质检单
    qualityCheckChange(val) {
      this.selectQualityCheck = val
    },
    // 质检单下一步
    nextStep() {
      this.newVisible = true
      this.arrivalVisible = false
      this.newOrderTitle = this.arrivalTitle
      this.newPurchaseOrder = {
        ...this.newPurchaseOrder,
        ...this.selectQualityCheck,
        PartnerId: Number(this.selectQualityCheck.PartnerId) == 0 ? '' : Number(this.selectQualityCheck.PartnerId),
        PreviousId: this.selectQualityCheck.QualityCode,
        ChargeUserId: this.ChargeUserId,
        ChargeUser: this.ChargeUser,
        Preprice: this.$root.toFloat(this.selectQualityCheck.Preprice)
      }
      if(this.arrivalTitle === '分秤入库' || this.arrivalTitle === '旧货转成品入库') {
        this.newPurchaseOrder.PurchaseType = PurchaseType.Purchase
        this.newPurchaseOrder.FinanceType = FinanceType.TypeArray[0].KeyId
      }
    },
    arrivalConfirm() {
      this.arrivalVisible = false
      this.newPurchaseOrder.PreviousId = this.selectQualityCheck.QualityCode
    },
    arrivalClose() {
      this.selectQualityCheck = {}
      this.arrivalVisible = false
      this.$refs['arrivalSearch'].resetFields()
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          IntakeId: this.reviewData[0].IntakeId,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDIT(para).then(res => {
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
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECT(para).then(res => {
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
          this.$message.error('请选择待审核的成品进货入库单!')
          return false
        }
        const para = {
          Items: this.expandRows,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDITS(para).then(res => {
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
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECTS(para).then(res => {
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
    }
  },
  created() {},
  mounted() {
    this.getKind()
    this.getBuyerList()
    this.getPositionList()
    this.getSupplierList()
    this.init()
    this.ChargeUserId = Number(JSON.parse(decodeURIComponent(`${localStorage.getItem('userInfo')}`)).UserId)
    this.ChargeUser = JSON.parse(decodeURIComponent(`${localStorage.getItem('userInfo')}`)).TrueName
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
.el-form-item{
  margin-bottom: 15px;
}
.iconMores {
  background-color: #fff !important;
  width: 32px;
  border: 1px solid #DCDFE6 !important;
  padding: 7px;
}
</style>
