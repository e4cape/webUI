<template>
  <el-dialog title="选择成品进货入库单" :visible.sync="visible" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="queryForm.PartnerName" :filterable="true" placeholder="所有创建人">
              <el-option label="所有供应商" :value="''"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.suppliers"
                :key="index"
                :label="item.Value"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input
              v-model="queryForm.IntakeCode"
              placeholder="单据编号"
              prefix-icon="el-icon-search"
              @keyup.enter.native="search"
              @blur="search"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        :data="data"
        class="tabke-tb"
        @sort-change="sortChange"
        @row-click="selectRow"
        highlight-current-row
        v-loading="tbLoading"
        element-loading-text="拼命加载中"
        ref="adjustTb"
      >
        <el-table-column
          prop="IntakeCode"
          label="单据编号"
          min-width="120"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          min-width="120"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IntakeQty" label="采购数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckTime" label="最后操作时间" min-width="140" sortable="custom">
          <template slot-scope="scope">{{ scope.row.CheckTime | filterDateTime }}</template>
        </el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination
        :pg="queryForm.PageIndex"
        :size="queryForm.PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
      <!-- End 分页组件 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="selectPrice" :loading="$store.getters.is_loading">确定</el-button>
      <el-button @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { YNStatus, EnableState } from '@/enums/common.js'
import {
  GoodsPriceOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import { STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS } from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'

import pagination from '@/components/pagination'
export default {
  props: {
    adjustTakeVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      YNStatus,
      goodsPriceOrderBasicStates: GoodsPriceOrderBasicState,
      settingDictionaryDictTypes: SettingDictionaryDictType,
      visible: this.adjustTakeVisible,
      queryForm: {
        IntakeCode: '',
        PartnerName: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 1,
        IsAsced: YNStatus.No
      },
      adjustId: '',
      data: [],
      total: 0,
      adjustReasons: [],
      tbLoading: false
    }
  },
  methods: {
    getData() {
      this.tbLoading = true
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS(
        Object.assign(this.queryForm, {
          State: this.goodsPriceOrderBasicStates.Audit
        })
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        } else {
          this.$message.error(res.data.Data.Message)
        }
        this.tbLoading = false
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'IntakeCode':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 1
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.search()
    },
    search() {
      this.queryForm.PageIndex = 1
      this.getData()
    },
    selectPrice() {
      if (!this.adjustId) {
        this.$message('请选择入库单', 'error')
      } else {
        this.$emit('listenAdjustTakeDialog', this.adjustId)
        this.$store.commit('SET_BTN_LOADING', true)
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
      this.adjustId = row.IntakeId
      this.$refs.adjustTb.setCurrentRow(row)
    },
    getAdjustReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes
          .GoodsPriceOrderBasicReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.adjustReasons = res.data.Data.Rows || []
        }
      })
    },
    getCreators() {
      // 获取创建人
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    }
  },
  beforeMount() {
    this.getData()
    this.getCreators()
    this.getAdjustReason()
  },
  watch: {
    visible() {
      this.$emit('listenAdjustTakeDialog', false)
    },
    'queryForm.ReasonId': 'search',
    'queryForm.CreateUserId': 'search'
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
