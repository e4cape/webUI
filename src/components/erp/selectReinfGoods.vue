<template>
  <el-dialog title="选择货品" :visible.sync="visible" width="1280px" custom-class="select-dialog">
    <el-row style="margin-bottom: 20px;" :gutter="2">
      <el-col :span="3">
        <el-select name="StockTurnType" v-model="queryForm.StockTurnType" @change="search" placeholder="所有情况" filterable>
          <el-option label="所有情况" :value="0"></el-option>
          <el-option v-for="(item,index) in stockTurnTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="StockTurnStatus" v-model="queryForm.StockTurnStatus" @change="search" placeholder="所有状态" :filterable="true">
          <el-option label="所有状态" :value="0"></el-option>
          <el-option v-for="(item,index) in stockTurnStatuss.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="MaterialType" v-model="queryForm.MaterialType" @change="search" placeholder="所有材质" filterable>
          <el-option label="所有材质" :value="0"></el-option>
          <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="CategoryType" v-model="queryForm.CategoryType" @change="search" placeholder="所有品类" filterable>
          <el-option label="所有品类" :value="0"></el-option>
          <el-option v-for="(item,index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="GoldType" v-model="queryForm.GoldType" @change="search" placeholder="所有成色" filterable>
          <el-option label="所有成色" :value="0"></el-option>
          <el-option v-for="(item,index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="GoodsType" v-model="queryForm.GoodsType" @change="search" placeholder="所有类型" filterable>
          <el-option label="所有类型" :value="0"></el-option>
          <el-option v-for="(item,index) in goodsTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="FinanceType" v-model="queryForm.FinanceType" @change="search" placeholder="所有类别" filterable>
          <el-option label="所有类别" :value="0"></el-option>
          <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select name="StockCompareType" v-model="queryForm.StockCompareType" @change="search" placeholder="所有库存" filterable>
          <el-option label="所有库存" :value="0"></el-option>
          <el-option v-for="(item,index) in stockCompareTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-form :model="queryForm" :rules="queryRules" label-position="right" label-width="100px" class="list-query-form" ref="fromsss" :class="{all: queryAll}">
      <el-row :span="24">
        <el-col :span="20">
          <el-row :span="24">
            <el-col :span="8">
              <el-form-item label="条码：">
                <el-input name="StoreBarCode" v-model="queryForm.StoreBarCode" :maxlength="50" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="款号：">
                <el-input name="StoreStyleNumber" v-model="queryForm.StoreStyleNumber" :maxlength="50" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货品名称：">
                <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" class="tc">
          <el-button name="btnSearch" type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="20">
          <el-row :span="24">
            <el-col :span="8">
              <el-form-item label="账面库存：">
                <el-col :span="11">
                  <el-form-item prop="FinanceQty1" class="inline no-margin">
                    <el-input name="FinanceQty1" v-model="queryForm.FinanceQty1" :maxlength="9" @keyup.enter.native="search"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="tc">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="FinanceQty2" class="inline no-margin">
                    <el-input name="FinanceQty2" v-model="queryForm.FinanceQty2" :maxlength="9" @keyup.enter.native="search"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库日期：" class="fix-w">
                <el-date-picker name="createTime" v-model="createTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最近销售日期：" class="fix-w">
                <el-date-picker name="lastSaleTime" v-model="lastSaleTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" class="tc">
          <el-button name="btnReset" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- End 筛选条件 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectChange" v-loading="seachSelectLoading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="StoreBarCode" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreStyleNumber" label="款号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" min-width="100" label="货品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FinanceType" label="货品类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{goodsTypes.Types[scope.row.GoodsType]}}</template>
      </el-table-column>
      <el-table-column prop="Quantity" min-width="100" label="入库数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FinanceQty" label="账面库存" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CostPrice" label="成本价" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="入库日期" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="LastSaleTime" sortable="custom" label="最近销售日期" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.LastSaleTime | filterDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StockTurnType" label="周转情况" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.StockTurnType === stockTurnTypes.HighTurn ? 'stockTurn-red' : scope.row.StockTurnType === stockTurnTypes.LowTurn ? 'stockTurn-green' : 'stockTurn-gray'"
          >{{stockTurnTypes.Types[scope.row.StockTurnType]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StockTurnStatus" label="库存状态" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stockTurnStatuss.Types[scope.row.StockTurnStatus]}}</template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <pagination :pg="pg" :size="size" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <el-checkbox name="checked" v-if="!showChecked" class="fl" v-model="checked">带入可用库存</el-checkbox>
      <el-button name="btnAdd" type="primary" @click="addGoods(false)" :loading="$store.getters.is_loading">添加</el-button>
      <el-button name="btnAddAndClose" type="primary" @click="addGoods(true)" :loading="$store.getters.is_loading">添加并关闭</el-button>
      <el-button name="btnCancel" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  ReportStockTurnType,
  ReportStockTurnStatus,
  GoodsType,
  FinanceType,
  StockCompareType
} from '@/enums/stocking.js'
import {
  STOCKING_API_REPORT_BYSTOCKQTYTURNOVER
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'
export default {
  props: {
    dialogSelectGoodsVisible: Boolean,
    deskId: Number,
    showChecked: Boolean
  },
  data() {
    return {
      YNStatus,
      stockTurnTypes: ReportStockTurnType,
      stockTurnStatuss: ReportStockTurnStatus,
      visible: this.dialogSelectGoodsVisible,
      goodsTypes: GoodsType,
      financeTypes: FinanceType,
      stockCompareTypes: StockCompareType,
      queryRules: {
        FinanceQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.FinanceQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.FinanceQty2)
              ) {
                callback(new Error('不能大于结束值'))
              }
              callback()
            }
          }
        ],
        FinanceQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.FinanceQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.FinanceQty1)
              ) {
                callback(new Error('不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      queryForm: {
        StockTurnType: 0,
        GoodsType: 0,
        StockTurnStatus: 0,
        StockCompareType: 0,
        MaterialType: 0,
        FinanceType: 0,
        FinanceQty1: '',
        FinanceQty2: '',
        CategoryType: 0,
        GoldType: 0,
        StoreBarCode: '',
        StoreStyleNumber: '',
        GoodsName: ''
      },
      createTime: '',
      lastSaleTime: '',
      code: '',
      queryAll: false,
      data: [],
      total: 0,
      pg: 1,
      size: 10,
      orderBy: 3, // 0=入库日期 1==条码 2==款号 3==最近销售日期(默认)
      isAsc: YNStatus.No,
      selectData: [],
      close: false,
      goodsTimer: '',
      seachSelectLoading: false,
      checked: false
    }
  },
  methods: {
    getData() {
      let createTime = this.createTime.length
        ? this.createTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00'] // 入库的时间
      let lastSaleTime = this.lastSaleTime.length
        ? this.lastSaleTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00'] // 最后零售的时间
      this.seachSelectLoading = true
      STOCKING_API_REPORT_BYSTOCKQTYTURNOVER({
        StockCompareType: this.queryForm.StockCompareType,
        FinanceQty1: this.queryForm.FinanceQty1,
        FinanceQty2: this.queryForm.FinanceQty2,
        StoreBarCode: this.queryForm.StoreBarCode,
        StoreStyleNumber: this.queryForm.StoreStyleNumber,
        GoodsName: this.queryForm.GoodsName,
        FinanceType: this.queryForm.FinanceType,
        GoodsType: this.queryForm.GoodsType,
        MaterialType: this.queryForm.MaterialType,
        CategoryType: this.queryForm.CategoryType,
        GoldType: this.queryForm.GoldType,
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        LastSaleTime1: lastSaleTime[0],
        LastSaleTime2: lastSaleTime[1],
        StockTurnType: this.queryForm.StockTurnType,
        StockTurnStatus: this.queryForm.StockTurnStatus,
        OrderBy: this.orderBy,
        IsAsc: this.isAsc,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
          this.total = this.data.length && this.data[0].TOTALCOUNT
        }
        this.seachSelectLoading = false
      })
    },
    reset() {
      this.queryForm = {
        StockTurnType: this.queryForm.StockTurnType,
        GoodsType: this.queryForm.GoodsType,
        StockTurnStatus: this.queryForm.StockTurnStatus,
        StockCompareType: this.queryForm.StockCompareType,
        MaterialType: this.queryForm.MaterialType,
        FinanceType: this.queryForm.FinanceType,
        FinanceQty1: '',
        FinanceQty2: '',
        CategoryType: this.queryForm.CategoryType,
        GoldType: this.queryForm.GoldType,
        StoreBarCode: '',
        StoreStyleNumber: '',
        GoodsName: ''
      }
      this.lastSaleTime = ''
      this.createTime = ''
      this.search()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'LastSaleTime':
          this.orderBy = 3
          break
        case 'StockTurnType':
          this.orderBy = 3
          break
        case 'StockTurnStatus':
          this.orderBy = 3
          break
        default:
          this.orderBy = 3
          break
      }
      this.isAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.search()
    },
    search() {
      this.$refs['fromsss'].validate(valid => {
        if (valid) {
          this.pg = 1
          this.getData()
        }
      })
    },
    addGoods(flag) {
      if (!this.selectData.length) {
        this.$message('请选择添加的货品', 'error')
      } else {
        let result = []
        this.selectData.forEach(item => {
          if (this.checked) {
            result.push({
              StoreBarCode: item.StoreBarCode,
              Quantity: item.AvailableQty
            })
          } else {
            result.push({
              StoreBarCode: item.StoreBarCode, Quantity: 1
            })
          }
        })
        this.$emit('listenAddGoods', result)
        if (flag) {
          this.visible = false
        } else {
          this.$store.commit('SET_BTN_LOADING', true)
        }
      }
    },
    currentChange(val) {
      this.pg = val
      this.getData()
    },
    sizeChange(val) {
      this.pg = 1
      this.size = val
      this.getData()
    },
    selectChange(selection) {
      this.selectData = selection
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    visible() {
      this.$emit('listenSelectGoods', false)
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  border-left: 1px solid #ebeef5;
}
.el-form-item__content {
  display: flex;
}
.pagination {
  margin-bottom: 0;
  padding: 0;
}
.stockTurn-red {
  color: #e64240;
}
.stockTurn-green {
  color: #09ba07;
}
.stockTurn-gray {
  color: #999999;
}
</style>
