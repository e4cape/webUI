<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button v-if="kindTypeArray.length === 0" type="primary" @click="$message.warning('请在“系统设置”的“科目设置”中添加种类')">新建</el-button>
          <el-button v-else-if="kindTypeArray.length === 1" type="primary" @click="handleCreateDialog(kindTypeArray[0])">新建</el-button>
          <el-dropdown v-else @command="handleCreateDialog" class="p-r-10">
            <el-button type="primary">
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, index) in kindTypeArray">
                <el-dropdown-item v-if="item.State === YNStatus.Yes" :key="index" :command="item">{{item.Value}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="multiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="onSearch" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <template v-for="(item,index) in GoodsAllotOrderOutakeState.Types">
                <el-option v-if="Number(index) !== GoodsAllotOrderOutakeState.Cancel" :key="index" :label="item" :value="String(index)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" name="OutakeCode" placeholder="单据编号">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="outTakeArr" label="发货仓库：" v-if="characterType === CharacterType.Company">
            <el-cascader v-model="queryForm.outTakeArr" :options="[{Value: '所有位置', Id: 0}, ...$store.getters.wareHouses]" :props="outTakePorp" change-on-select></el-cascader>
          </el-form-item>
          <el-form-item label="货品种类：" prop="KindTypeEk">
            <el-select v-model="queryForm.KindTypeEk">
              <el-option label="所有种类" value="0"></el-option>
              <template v-for="(item, index) in kindTypeArray">
                <el-option :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="调拨原因：" prop="ReasonTypeDk">
            <el-select v-model="queryForm.ReasonTypeDk">
              <el-option label="所有原因" value="0"></el-option>
              <template v-for="(item, index) in appropOutReasons">
                <el-option :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="调拨类型：" prop="SourceType" v-if="characterType === CharacterType.Company">
            <el-select v-model="queryForm.SourceType">
              <el-option label="所有类型" value="0"></el-option>
              <el-option v-for="(item, index) in GoodsAllotOrderOutakeSourceType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShippingType" label="收货方式：">
            <el-select v-model="queryForm.ShippingType" name="ShippingType">
              <el-option label="所有方式" value="0"></el-option>
              <el-option v-for="(item,index) in ShippingType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="IntakeState" label="所有情况：">
            <el-select v-model="queryForm.IntakeState" name="IntakeState">
              <el-option label="所有情况" value="0"></el-option>
              <el-option v-for="(item,index) in GoodsAllotOrderIntakeState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode" label="单据编号：">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" name="OutakeCode"></el-input>
          </el-form-item>
          <el-form-item prop="UnitedName2" label="收货位置：">
            <el-input v-model="queryForm.UnitedName2" :max="50"></el-input>
          </el-form-item>
          <el-form-item prop="ActualDate" label="业务日期：" name="ActualDate">
            <el-date-picker v-model="queryForm.ActualDate" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：" name="createTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ExpressCode" label="快递单号：">
            <el-input v-model="queryForm.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：" name="checkTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="PreviousCode" label="门店分货单：" v-if="characterType === CharacterType.Company">
            <el-input v-model="queryForm.PreviousCode" :maxlength="50" name="PreviousCode"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" ref="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="OutakeCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="发货仓库" min-width="160" show-overflow-tooltip v-if="characterType === CharacterType.Company">
        <template slot-scope="scope">{{scope.row.UnitedName1==='总部'? `${scope.row.WarehouseName1}` : scope.row.UnitedName1 }}</template>
      </el-table-column>
      <el-table-column prop="WarehouseName2" label="收货单位" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName2 && characterType === CharacterType.Company? `${scope.row.WarehouseName2}` : scope.row.UnitedName2 }}</template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <template v-if="characterType === CharacterType.Company">
        <el-table-column prop="SourceType" label="调拨类型" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PreviousCode" label="门店分货单" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SplitQty" label="分货数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsQty" label="调拨数量" min-width="100" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="characterType === CharacterType.Store">
        <div>
          <el-table-column prop="GoodsQty" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoldWeight" label="金重" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
        </div>
      </template>
      <el-table-column prop="Preprice" label="结算金额" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShippingType" label="收货方式" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ExpressCode" label="快递单号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
            <span :class="scope.row.State | findKey(GoodsAllotOrderOutakeState)">{{GoodsAllotOrderOutakeState.Types[scope.row.State]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="IntakeState" label="收货情况" min-width="160" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            :disabled="!(scope.row.CheckNote && scope.row.IntakeState === GoodsAllotOrderIntakeState.Reject || scope.row.IntakeTime && scope.row.IntakeState === GoodsAllotOrderIntakeState.Audit)"
            class="item"
            :content="scope.row.IntakeState === GoodsAllotOrderIntakeState.Reject ? scope.row.CheckNote : $options.filters.filterDateMinutes(scope.row.IntakeTime)"
            placement="top"
            effect="light"
          >
            <span>{{GoodsAllotOrderIntakeState.Types[scope.row.IntakeState]||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/goodsappropout/check',query:{ id:scope.row.OutakeId }}" class="btn-link el-button el-button--text" name="btnShowDetail">查看</router-link>
          <template
            v-if="characterType === CharacterType.Store || (GoodsAllotOrderOutakeStreamType.Warehouse === scope.row.StreamType ||GoodsAllotOrderOutakeStreamType.Warehouse2Store === scope.row.StreamType)"
          >
            <template v-if="scope.row.State === GoodsAllotOrderOutakeState.Reject || scope.row.State === GoodsAllotOrderOutakeState.Draft">
              <router-link :to="{path:'/depot/goodsappropout/edit',query:{id:scope.row.OutakeId}}" class="btn-link el-button el-button--text" name="btnAppropOutEdit">编辑</router-link>
              <el-button type="text" @click="appropOutAbandon(scope.row)" name="btnAppropOutAbandon">作废</el-button>
            </template>
            <el-button type="text" @click="appropOutAudit(scope.row)" v-if="scope.row.State === GoodsAllotOrderOutakeState.Wait" name="btnAppropOutAudit">审核</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·新建成品调拨出库单 -->
    <el-dialog title="新建成品调拨出库单" :visible.sync="createDialog" @close="resetCreateForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="发货位置" required v-if="characterType === CharacterType.Company">
          <div class="position">
            <el-form-item prop="WarehouseId1" class="item">
              <el-select v-model="createForm.WarehouseId1" @change="getShelfId1List">
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId1" class="item">
              <el-select v-model="createForm.ShelfId1">
                <el-option v-for="(item, index) in shelfId1List" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="调拨原因" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" @change="handleReasonType" placeholder="请选择" name="ReasonTypeDk">
            <template v-for="(item, index) in appropOutReasons">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item required v-if="characterType === CharacterType.Company" label="收货单位" key="inTakeArr">
          <div class="position">
            <el-form-item prop="WarehouseId2" class="item">
              <el-select v-model="createForm.WarehouseId2" @change="getShelfId2List">
                <el-option v-for="(item, index) in inTakePosition" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId2" class="item" v-if="hasShelf">
              <el-select v-model="createForm.ShelfId2">
                <el-option v-for="(item, index) in shelfId2List" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item v-else label="收货单位" prop="StorechterId2" key="StorechterId2">
          <el-select v-model="createForm.StorechterId2">
            <el-option :value="0" label="总部仓库"></el-option>
            <template v-for="(item, index) in $store.getters.stores">
              <el-option v-if="item.State === YNStatus.Yes && item.Id !== 0 && item.CharacterId !== $store.getters.user_session.CharacterId" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="收货方式" prop="ShippingType">
          <el-radio-group v-model="createForm.ShippingType" name="ShippingType">
            <el-radio v-for="(item,index) in ShippingType.Types" :key="index" :label="parseInt(index)">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务日期" prop="ActualDate">
          <el-date-picker v-model="createForm.ActualDate" :picker-options="$store.getters.businessDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="快递公司" prop="ExpressType">
          <el-select v-model="createForm.ExpressType" clearable name="ExpressType">
            <el-option v-for="(item, index) in ExpressType.Types" :key="index" :label="item" :value="index*1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="ExpressCode">
          <el-input v-model="createForm.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
        </el-form-item>
        <el-form-item label="发货人" prop="SendUser">
          <el-input v-model="createForm.SendUser" :maxlength="50" name="SendUser"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话" prop="SendPhone">
          <el-input v-model="createForm.SendPhone" :maxlength="11" name="SendPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="ReceiptUser">
          <el-input v-model="createForm.ReceiptUser" :maxlength="50" name="ReceiptUser"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="ReceiptPhone">
          <el-input v-model="createForm.ReceiptPhone" :maxlength="11" name="ReceiptPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" v-model="createForm.Note" :maxlength="200" name="Note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createappropOut" :loading="$store.getters.is_loading" name="btnCreateappropOut">确 定</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品调拨出库单 -->

    <!-- @module Dialog·新建调拨出库原因 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="appropOutReasons" dialogTitle="调拨出库原因" :dictType="SettingDictionaryDictType.GoodsAllotOrderOutakeReasonType" @listenDictSave="getappropOutReason"></dict-manage>
    <!-- End Dialog·新建调拨出库原因  -->

    <!-- @module Dialog·审核 -->
    <appropOut-audit :visible.sync="auditDialog" :data="selections" @listenAuditDialog="listenAuditDialog"></appropOut-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <appropOut-abandon :visible.sync="abandonDialog" :data="abandonAppropOut" @listenAbandonDialog="getData"></appropOut-abandon>
    <!-- End Dialog·作废 -->
  </div>
</template>

<script>
import {
  YNStatus,
  CharacterType,
  ShippingType,
  ExpressType
} from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  SettingDictionaryDictType,
  GoodsAllotOrderOutakeSourceType,
  GoodsAllotOrderIntakeState,
  GoodsAllotOrderOutakeState,
  GoodsAllotOrderOutakeStreamType
  // GoodsStockLogOrderType,
  // SettingCustomizedFieldLargeType
} from '@/enums/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant.js'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_CREATE,
  // STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import appropOutAbandon from './appropOutAbandon'
import appropOutAudit from './appropOutAudit'
export default {
  data() {
    return {
      ExpressType,
      CharacterType,
      YNStatus,
      ShippingType,
      SettingDictionaryDictType,
      GoodsAllotOrderOutakeSourceType,
      GoodsAllotOrderIntakeState,
      GoodsAllotOrderOutakeState,
      GoodsAllotOrderOutakeStreamType,
      appropOutReasons: [], // 调拨出库原因
      kindTypeArray: [], // 货品种类下拉
      outTakePorp: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      queryForm: {
        // 查询表单数据
        outTakeArr: [0],
        WarehouseId1: '0',
        ShelfId1: '0',
        ReasonTypeDk: '0',
        SourceType: '0',
        ShippingType: '0',
        KindTypeEk: '0',
        IntakeState: '0',
        State: '0',
        CreateUserId: '0',
        OrderBy: '1',
        IsAsced: String(YNStatus.No),
        OutakeCode: '',
        ExpressCode: '',
        PreviousCode: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: '',
        ActualDate1: '',
        ActualDate2: '',
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: [],
        ActualDate: [],
      },
      data: [],
      total: 0,
      selections: [], // 选中的单据
      createDialog: false, // 新建对话框
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonAppropOut: {}, // 作废调拨出库单
      reasonDialog: false, // 新建调拨出库原因对话框
      createOrEdit: true,
      parameters: {},
      createForm: {
        WarehouseId1: '',
        ShelfId1: '',
        WarehouseId2: '',
        ShelfId2: '',
        StorechterId2: '',
        KindTypeEk: '',
        KindTypeEv: '',
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        ShippingType: ShippingType.PickedUp,
        ExpressType: '',
        ExpressCode: '',
        SendUser: '',
        ShipperTel: '',
        SendPhone: '',
        ReceiptUser: '',
        ReceiptPhone: '',
        ActualDate: '',
        Note: ''
      },
      createRules: {
        WarehouseId1: [
          {
            required: true,
            message: '请选择发货位置',
            trigger: 'change'
          }
        ],
        WarehouseId2: [
          {
            required: true,
            message: '请选择发货位置',
            trigger: 'change'
          }
        ],
        ShelfId1: [
          {
            required: true,
            message: '请选择发货位置',
            trigger: 'change'
          }
        ],
        ShelfId2: [
          {
            required: true,
            message: '请选择发货位置',
            trigger: 'change'
          }
        ],
        ReasonTypeDk: [
          {
            required: true,
            message: '请选择调拨原因',
            trigger: 'change'
          }
        ],
        inTakeArr: [
          {
            required: true,
            message: '请选择收货单位',
            trigger: 'change'
          }
        ],
        StorechterId2: [
          {
            required: true,
            message: '请选择收货单位',
            trigger: 'change'
          }
        ],
        ShippingType: [
          {
            required: true,
            message: '请选择收货方式',
            trigger: 'change'
          }
        ],
        ActualDate: [{required: true, message: '请选择日期', trigger: 'change'}]
      },
      shelfId1List: [],
      shelfId2List: [],
      inTakePosition: [],
      hasShelf: true // 是否有货架
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination,
    dictManage,
    appropOutAudit,
    appropOutAbandon
  },
  methods: {
    getappropOutReason() {
      // 获取调拨出库原因下拉
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.GoodsAllotOrderOutakeReasonType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.appropOutReasons = res.data.Data.Rows
          if (!this.appropOutReasons.some(item => item.Id === this.createForm.ReasonTypeDk)) {
            this.createForm.ReasonTypeDk = ''
            this.createForm.ReasonTypeDv = ''
          }
        }
      })
    },
    handleReasonType(val) {
      this.createForm.ReasonTypeDv = this.appropOutReasons.find(
        item => item.Id == val
      ).Value
    },
    getEnums() {
      this.$store.dispatch('GET_SETTLE_DATE')
      this.getappropOutReason()
      // 货品种类
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kindTypeArray = res.data.Data.Rows
        }
      })
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_STORES_DROPLIST').then(res => {
        this.$store.dispatch('GET_WAREHOUSES_DROPLIST', { HasShelf: YNStatus.Yes, State: YNStatus.Yes }).then(() => {
          let store = []
          res.forEach(item => {
            if (item.State === YNStatus.Yes) {
              store.push({
                Id: item.CharacterId,
                Value: item.Value
              })
            }
          })
          this.inTakePosition = [...this.$store.getters.wareHouses.filter(item => item.State === YNStatus.Yes), ...store]
        })
      })
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'SourceType':
          return GoodsAllotOrderOutakeSourceType.Types[val]
        case 'ShippingType':
          return ShippingType.Types[val]
        case 'Preprice':
          return '￥' + this.$root.toFloat(val)
        case 'GoldWeight':
          return this.$root.toFloat(val, 3) + 'g'
        case 'ActualDate':
          return this.$options.filters.filterDate(val)
        default:
          break
      }
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.GoodsAllotOrderOutakeState.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的调拨出库单')
      } else {
        this.auditDialog = true
      }
    },
    handleCreateDialog(command) {
      // 弹出创建弹窗
      // STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS({
      //   OrderType: GoodsStockLogOrderType.GoodsAllotOrderOutake,
      //   LargeType: SettingCustomizedFieldLargeType.Order,
      //   KindTypeEk: 1,
      // }).then(res => {

      // })
      this.createDialog = true
      this.createForm.KindTypeEk = command.Id
      this.createForm.KindTypeEv = command.Value
      this.createForm.ActualDate = this.$options.filters.filterAllDate(new Date())
    },
    getShelfId1List(val) {
      // 发货位置货架下拉
      this.shelfId1List = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.createForm.ShelfId1 =
        this.shelfId1List.length === 1 ? this.shelfId1List[0].Id : ''
    },
    getShelfId2List(val) {
      // 收货位置货架下拉
      if (this.inTakePosition.find(item => item.Id === val).Childrens) {
        this.createForm.StorechterId2 = 0
        this.hasShelf = true
        this.shelfId2List = this.inTakePosition.find(
          item => item.Id === val
        ).Childrens.filter(item => item.State === YNStatus.Yes)
        this.createForm.ShelfId2 =
          this.shelfId2List.length === 1 ? this.shelfId2List[0].Id : ''
      } else {
        this.hasShelf = false
        this.createForm.ShelfId2 = 0
        this.createForm.StorechterId2 = val
      }
    },
    createappropOut() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let param = { ...this.createForm }
          param.ExpressType = param.ExpressType
            ? param.ExpressType
            : 0
          param.WarehouseId1 = param.WarehouseId1 || 0
          param.ShelfId1 = param.ShelfId1 || 0
          param.WarehouseId2 = !param.StorechterId2 && param.WarehouseId2 ? param.WarehouseId2 : 0
          param.ShelfId2 = param.ShelfId2 || 0
          if (
            this.characterType === CharacterType.Company &&
            param.WarehouseId1 === param.WarehouseId2 &&
            param.ShelfId1 === param.ShelfId2
          ) {
            this.$message.warning('收货位置和发货位置不能相同')
            return false
          }
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_CREATE(param).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.$router.push({
                  path: '/depot/goodsappropout/edit',
                  query: {
                    id: res.data.Data
                  }
                })
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    resetCreateForm() {
      this.$refs['createForm'].resetFields()
      this.createForm.ExpressType = ''
    },
    appropOutAudit(row) {
      this.selections = [row]
      this.auditDialog = true
    },
    appropOutAbandon(row) {
      this.abandonAppropOut = row
      this.abandonDialog = true
    },
    listenDictDialog() {
      this.reasonDialog = false
    },
    listenAuditDialog(success) {
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (success) {
        this.getData()
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            outTakeArr: [0],
            WarehouseId1: '0',
            ShelfId1: '0',
            ReasonTypeDk: '0',
            SourceType: '0',
            ShippingType: '0',
            KindTypeEk: '0',
            IntakeState: '0',
            State: '0',
            CreateUserId: '0',
            OrderBy: '1',
            IsAsced: String(YNStatus.No),
            OutakeCode: '',
            ExpressCode: '',
            PreviousCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            ActualDate1: '',
            ActualDate2: '',
            PageIndex: 1,
            PageSize: 20,
            CreateTime: [],
            CheckTime: [],
            ActualDate: [],
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
      query.ActualDate = query.ActualDate || []
      query.outTakeArr = [parseInt(query.WarehouseId1), parseInt(query.ShelfId1)]
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = Object.assign({}, query)
      this.queryForm = {
        ...this.parameters
      }
      this.getData()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'OutakeCode':
          this.parameters.OrderBy = 0
          break
        case 'CreateTime':
          this.parameters.OrderBy = 1
          break
        case 'CheckTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.initRoute()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if (this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (this.queryForm.CreateTime) {
        this.queryForm.CreateTime1 = this.queryForm.CreateTime[0]
        this.queryForm.CreateTime2 = this.queryForm.CreateTime[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      if (this.queryForm.CheckTime) {
        this.queryForm.CheckTime1 = this.queryForm.CheckTime[0]
        this.queryForm.CheckTime2 = this.queryForm.CheckTime[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      if (this.queryForm.ActualDate) {
        this.queryForm.ActualDate1 = this.queryForm.ActualDate[0]
        this.queryForm.ActualDate2 = this.queryForm.ActualDate[1]
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate2 = ''
      }
      this.queryForm.WarehouseId1 = this.queryForm.outTakeArr[0] || 0
      this.queryForm.ShelfId1 = this.queryForm.outTakeArr[1] || 0
      this.queryForm.isSenior = true
      if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.parameters = { ...this.queryForm }
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
        path: this.$router.path,
        query: this.parameters
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.position {
  display: flex;
  .item {
    margin-bottom: 0 !important;
    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
