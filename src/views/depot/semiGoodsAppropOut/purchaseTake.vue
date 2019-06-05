<template>
  <el-dialog title="选择半成品整包入库单" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="queryForm.PartnerId" @change="search" name="PartnerId">
              <el-option label="所有供应商" value="0"></el-option>
              <template v-for="(item,index) in $store.getters.suppliers">
                <el-option v-if="item.PartnerType === PartnerType.Merchant || item.PartnerType === PartnerType.Supplier" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="queryForm.IntakeCode" placeholder="单据编号" prefix-icon="el-icon-search" @keyup.enter.native="search" @blur="search" name="IntakeCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="data" @sort-change="sortChange" @row-click="selectRow" highlight-current-row v-loading="tbLoading" element-loading-text="拼命加载中" ref="purchaseTb">
        <el-table-column prop="IntakeCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PackageNo" label="包号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="采购数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight" label="采购重量(g)" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="160" sortable="custom"></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-checkbox class="fl" v-model="checked" name="checked">带入可用库存</el-checkbox> -->
      <el-button type="primary" @click="selectPurchase" name="btnSelectPurchase" :loading="$store.getters.is_loading">确定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { YNStatus, PartnerType } from '@/enums/common.js'
import pagination from '@/components/pagination'
import { STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS } from '@/apis/stocking.js'
import { HalfIntakeOrderBasicState } from '@/enums/stocking'

export default {
  props: {
    visible:{
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: Number,
      default: 0
    },
    shelfId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      PartnerType,
      YNStatus,
      queryForm: {
        PartnerId: '0',
        IntakeCode: '',
        State: HalfIntakeOrderBasicState.Audit,
        WarehouseId: 0,
        ShelfId: 0,
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      selectData: {},
      data: [],
      total: 0,
      tbLoading: false,
      checked: true
    }
  },
  methods: {
    selectPurchase() {
      if (!this.selectData.IntakeId) {
        this.$message.warning('请选择半成品采购入库单')
      } else {
        let obj = {}
        if (this.checked) {
          obj = {
            IntakeId: this.selectData.IntakeId
          }
        } else {
          obj = {
            IntakeId: this.selectData.IntakeId
          }
        }
        this.$emit('listenPurchaseTakeDialog', obj)
        this.$store.commit('SET_BTN_LOADING', true)
      }
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        default:
          return this.$root.toFloat(val, 3) + 'g'
      }
    },
    getData() {
      this.tbLoading = true
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.tbLoading = false
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'IntakeCode':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 1
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
      // this.$refs.purchaseTb.setCurrentRow(row)
    }
  },
  created() {
    this.getSupplier()
  },
  watch: {
    visible(val) {
      if (val) {
        this.queryForm.WarehouseId = this.warehouseId
        this.queryForm.ShelfId = this.shelfId
        this.getData()
      }
      
    }
  },
  components: {
    pagination
  }
}
</script>
