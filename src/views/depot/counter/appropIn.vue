<template>
  <el-dialog title="选择成品调拨入库单" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="queryForm.UnitedName1" placeholder="来源" prefix-icon="el-icon-search" @keyup.enter.native="search" @blur="search" name="UnitedName1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="queryForm.IntakeCode" placeholder="单据编号" prefix-icon="el-icon-search" @keyup.enter.native="search" @blur="search" :maxlength="50" name="IntakeCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="data" @sort-change="sortChange" @row-click="selectRow" highlight-current-row v-loading="tbLoading" element-loading-text="拼命加载中" ref="appropInTb">
        <el-table-column prop="IntakeCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="UnitedName1" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SendTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ReceiveTime" label="收货时间" :formatter="formatter" sortable="custom"  min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsQty" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-checkbox v-if="showChecked" class="fl" v-model="checked" name="checked">带入可用库存</el-checkbox> -->
      <el-button type="primary" @click="selectAppropIn" :loading="$store.getters.is_loading" name="btnSelectAppropIn">确定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import { GoodsAllotOrderIntakeState } from '@/enums/stocking.js'
import pagination from '@/components/pagination'
import { STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GETS } from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      YNStatus,
      queryForm: {
        IntakeCode: '',
        State: GoodsAllotOrderIntakeState.Audit,
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
    formatter(row, column, val) {
      switch (column.property) {
        case 'SendTime':
        case 'ReceiveTime':
          return this.$options.filters.filterDateMinutes(val)
        default:
          return
      }
    },
    getData() {
      this.tbLoading = true
      STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.total || 0
        }
        this.tbLoading = false
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'IntakeCode':
          this.queryForm.OrderBy = 0
          break
        case 'ReceiveTime':
          this.queryForm.OrderBy = 2
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
    selectAppropIn() {
      if (!this.selectData.IntakeId) {
        this.$message.warning('请选择调拨入库单')
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        // if (this.checked) {
        //   obj = {
        //     IntakeId: this.selectData.IntakeId,
        //     ynstate: true
        //   }
        // } else {
        //   obj = {
        //     IntakeId: this.selectData.IntakeId,
        //     ynstate: false
        //   }
        // }
        this.$emit('listenAppropInDialog', this.selectData.IntakeId)
      }
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

    selectRow(row) {
      this.selectData = row
      this.$refs.appropInTb.setCurrentRow(row)
    }
  },
  beforeMount() {
    this.getData()
  },
  watch: {
    visible(val) {
      if (val) {
        this.search()
      }
    },
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  border-left: 1px solid #ddd;
}
.pagination {
  margin-bottom: 0;
  padding: 0;
}
</style>
