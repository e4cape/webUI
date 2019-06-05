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
                v-for="item in HalfChangeOrderBasicState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ChangeCode">
            <el-input
              name="ChangeCode"
              v-model="queryForm.ChangeCode"
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
          <el-form-item label="单据编号：" prop="ChangeCode">
            <el-input
              name="ChangeCode"
              v-model="queryForm.ChangeCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select filterable name="CreateUserId" v-model="queryForm.CreateUserId">
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
    <div class="table-border">
      <el-table
        :data="data"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="45" fixed></el-table-column>
        <el-table-column
          prop="ChangeCode"
          fixed
          label="单据编号"
          min-width="140"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="WarehouseName" label="半成品位置" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.WarehouseName}}</template>
        </el-table-column>
        <el-table-column prop="KindTypeEv" label="种类" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
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
        <el-table-column label="数量" min-width="70" show-overflow-tooltip>
          <el-table-column prop="Quantity1" label="分秤前" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity2" label="分秤后" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity3" label="分秤差异" min-width="80" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.Quantity3 > 0 ? '+' + scope.row.Quantity3 : scope.row.Quantity3}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="重量" min-width="80" show-overflow-tooltip>
          <el-table-column prop="Weight1" label="分秤前" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{$root.toFloat(scope.row.Weight1, 3)}}g</template>
          </el-table-column>
          <el-table-column prop="Weight2" label="分秤后" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{$root.toFloat(scope.row.Weight2, 3)}}g</template>
          </el-table-column>
          <el-table-column prop="Weight3" label="分秤差异" min-width="80" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.Weight3 > 0 ? '+' + $root.toFloat(scope.row.Weight3, 3) : $root.toFloat(scope.row.Weight3, 3)}}g</template>
          </el-table-column>
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
              v-if="scope.row.State >= HalfChangeOrderBasicState.Reject && scope.row.CheckNote"
            >
              <div slot="content">{{scope.row.CheckNote}}</div>
              <span
                :class="scope.row.State | findKey(HalfChangeOrderBasicState)"
              >{{HalfChangeOrderBasicState.Types[scope.row.State] || '-'}}</span>
            </el-tooltip>
            <span
              :class="scope.row.State | findKey(HalfChangeOrderBasicState)"
              v-else
            >{{HalfChangeOrderBasicState.Types[scope.row.State] || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="140">
          <template slot-scope="scope">
            <router-link
              name="btnCheck"
              :to="{path:'/purchase/pointsBalance/pointsBalanceCheck',query:{id:scope.row.ChangeId}}"
              class="btn-link el-button el-button--text"
            >查看</router-link>
            <router-link
              name="btnEdit"
              :to="{path:'/purchase/pointsBalance/pointsBalanceEdit',query:{id:scope.row.ChangeId}}"
              class="btn-link el-button el-button--text"
              v-if="scope.row.State == HalfChangeOrderBasicState.Draft || scope.row.State == HalfChangeOrderBasicState.Reject"
            >编辑</router-link>
            <el-button
              name="btnAudit"
              type="text"
              @click="audit(scope.row)"
              v-if="scope.row.State == HalfChangeOrderBasicState.Wait"
            >审核</el-button>
            <el-button
              name="btnCancel"
              type="text"
              @click="cancelAudit(scope.row)"
              v-if="scope.row.State == HalfChangeOrderBasicState.Audit"
            >取消审核</el-button>
            <el-button
              name="btnInvalid"
              type="text"
              @click="invalid(scope.row)"
              v-if="scope.row.State == HalfChangeOrderBasicState.Draft || scope.row.State == HalfChangeOrderBasicState.Reject"
            >作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        <el-form-item label="半成品位置：" prop="WarehouseId" class="location">
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
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            name="ActualDate"
            v-model="createForm.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
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
          <el-radio :label="HalfChangeOrderBasicState.Audit">审核通过</el-radio>
          <el-radio :label="HalfChangeOrderBasicState.Reject">审核退回</el-radio>
          <el-input
            name="checkNote"
            style="width:178px;"
            v-model="checkNote"
            :disabled="isCheck === HalfChangeOrderBasicState.Audit"
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
      <el-form
        label-position="right"
        label-width="80px"
        :model="detailInfo"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="单据编号：">
          <span>{{detailInfo.ChangeCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detailInfo.CreateUser}}&nbsp;&nbsp;{{detailInfo.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="HalfChangeOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="HalfChangeOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === HalfChangeOrderBasicState.Audit"
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
              <span>{{detailInfo.ChangeCode}}</span>
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
import { HalfChangeOrderBasicState } from '@/enums/stocking'
import { YNStatus, PartnerType } from '@/enums/common'
import {
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_GETS,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_CREATE,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_CANCEL,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_ABANDON,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDIT,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDITS,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECTS,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECT
} from '@/apis/stocking'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      HalfChangeOrderBasicState,
      YNStatus,
      partnerType: PartnerType,
      queryForm: {
        Location: [''],
        KindTypeEk: '',
        ChangeCode: '',
        CreateUserId: '',
        CreateTime: '',
        PartnerId: '',
        CheckTime: '',
        ActualDate: '',
        State: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      wareHouses: [],
      selectedProductId: [],
      selectedProduct: [],
      parameter: {},
      kindTypes: [],
      shelf: [], // 新建货架位置
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      createTitle: '',
      createForm: {
        WarehouseId: '',
        ShelfId: '',
        PartnerId: '',
        KindTypeEk: 0,
        ActualDate: new Date().toJSON().substr(0, 10),
        Note: ''
      },
      createVisible: false, // 新建弹窗
      createRules: {
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
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        }
      },
      detailInfo: {},
      checkNote: '', // 取消、作废、退回原因
      auditCheck: false, // 审核弹窗
      cancelCheck: false, // 取消/作废弹窗
      cancelName: 'cancel',
      stateCheck: 5, // 审核结果
      allCheck: false, // 批量审核
      isCheck: 5, // 批量审核结果
      ntime: '', // 当前时间
      btime: '', // 月结开始时间
      etime: '' // 月结结束时间
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
      this.parameter.ChangeCode = query.ChangeCode || ''
      this.parameter.CreateUserId = query.CreateUserId || ''
      this.parameter.ActualDate = query.ActualDate || []
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.PartnerId = query.PartnerId || ''
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
      STOCKING_API_HALF_CHANGE_ORDER_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    createMaterial(command) {
      this.createTitle = `新建（${
        this.$store.getters.kindType.Types[command]
      }）`
      this.createForm.KindTypeEk = command * 1
      this.createForm.KindTypeEv = this.$store.getters.kindType.Types[command]
      this.createVisible = true
    },
    handleClose() {
      this.$refs.createForm.resetFields()
      this.createVisible = false
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          STOCKING_API_HALF_CHANGE_ORDER_BASIC_CREATE(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.createVisible = false
                this.$refs['createForm'].resetFields()
                this.$router.push({
                  path: '/purchase/pointsBalance/pointsBalanceEdit',
                  query: { id: res.data.Data }
                })
              }
            }
          )
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
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        case 'ChangeCode':
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
      this.selectedProduct = val
      this.selectedProductId = []
      val.forEach(item => {
        this.selectedProductId.push(item.ChangeId)
      })
    },
    audit(row) {
      // 审核弹窗
      this.detailInfo = row
      this.checkNote = ''
      this.stateCheck = HalfChangeOrderBasicState.Audit
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
          if (item.State !== this.HalfChangeOrderBasicState.Wait) {
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
      if (this.isCheck === HalfChangeOrderBasicState.Audit) {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDITS({
          Items: this.selectedProductId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('批量审核成功')
            this.allCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECTS({
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
      if (this.stateCheck === HalfChangeOrderBasicState.Audit) {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDIT({
          ChangeId: this.detailInfo.ChangeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECT({
          ChangeId: this.detailInfo.ChangeId,
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
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_CANCEL({
          ChangeId: this.detailInfo.ChangeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_ABANDON({
          ChangeId: this.detailInfo.ChangeId,
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

<style lang="scss">
.table-border {
  .el-table--border {
    border-left: none;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: none;
  }
}
</style>

<style lang="scss" scoped>
.el-table {
  .has-gutter {
    :first-child {
      :nth-last-child(2) {
        border-right: none;
      }
    }
  }
  tr {
    :last-child {
      border-right: none;
    }
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: none;
  }
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
