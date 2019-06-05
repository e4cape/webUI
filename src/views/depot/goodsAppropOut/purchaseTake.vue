<template>
  <el-dialog title="选择成品进货入库单" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="init" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="queryForm.PartnerName" @change="search" name="PartnerName">
              <el-option label="所有供应商" :value="''"></el-option>
              <template v-for="(item,index) in $store.getters.suppliers">
                <el-option v-if="item.PartnerType === PartnerType.Merchant || item.PartnerType === PartnerType.Supplier" :key="index" :label="item.Value" :value="item.Value"></el-option>
              </template>
              
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="queryForm.IntakeCode" placeholder="单据编号" prefix-icon="el-icon-search" @keyup.enter.native="search" @blur="search" :maxlength="50" name="IntakeCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
     
    </el-form>
     <el-table :data="data" @sort-change="sortChange" @row-click="selectRow" highlight-current-row v-loading="tbLoading" element-loading-text="拼命加载中" ref="purchaseTb">
        <el-table-column prop="IntakeCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IntakeQty" label="采购数量" min-width="100" show-overflow-tooltip></el-table-column>->
        <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="160" sortable="custom"></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <!-- <el-checkbox v-if="showChecked" class="fl" v-model="checked" name="checked">带入可用库存</el-checkbox> -->
      <el-button type="primary" @click="selectPurchase" :loading="$store.getters.is_loading" name="btnSelectPurchase">确定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import pagination from '@/components/pagination'
import { YNStatus, PartnerType } from '@/enums/common.js'
import { STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS } from '@/apis/stocking.js'
import { GoodsIntakeOrderBasicState } from '@/enums/stocking'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      PartnerType,
      YNStatus,
      queryForm: {
        PartnerName: '',
        IntakeCode: '',
        State: GoodsIntakeOrderBasicState.Audit,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      selectData: {},
      data: [],
      total: 0,
      tbLoading: false,
    }
  },
  methods: {
    init() {
      this.queryForm.PartnerName = ''
      this.queryForm.IntakeCode = ''
      this.queryForm.OrderBy = 0
      this.queryForm.IsAsced = YNStatus.No
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = 10
      this.search()
    },
    selectPurchase() {
      if (!this.selectData.IntakeId) {
        this.$message.warning('请选择采购入库单')
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        this.$emit('listenPurchaseTakeDialog', {IntakeId: this.selectData.IntakeId})
      }
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        default:
          return
      }
    },
    getData() {
      this.tbLoading = true
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.tbLoading = false
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'IntakeCode':
          this.queryForm.OrderBy = 3
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    search() {
      this.queryForm.PageIndex = 1
      this.getData()
    },
    
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    },
    getSupplier() {
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    selectRow(row) {
      this.selectData = row
    }
  },
  beforeMount() {
    this.getSupplier()
  },
  components: {
    pagination
  }
}
</script>