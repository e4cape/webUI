<template>
  <el-row>
    <el-form :model="queryForm" :rules="queryRules" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="库存状态：" prop="TurnStatus">
            <el-select name="TurnStatus" v-model="queryForm.TurnStatus" placeholder="所有状态">
              <el-option v-for="item in stockTurnStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="周转情况：" prop="TurnType">
            <el-select name="TurnType" v-model="queryForm.TurnType" placeholder="所有情况">
              <el-option v-for="item in stockTurnTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存：" prop="StockCompareType">
            <el-select name="StockCompareType" v-model="queryForm.StockCompareType" placeholder="所有库存">
              <el-option label="所有库存" :value="0"> </el-option>
              <el-option v-for="item in stockCompareTypes.TypeArray"  :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材质：" prop="MaterialType">
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质">
              <el-option label="所有材质" :value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类">
              <el-option label="所有品类" :value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色">
              <el-option label="所有成色" :value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货品类型：" prop="GoodsType">
            <el-select name="GoodsType" v-model="queryForm.GoodsType" placeholder="所有类型">
              <el-option label="所有类型" :value="0"> </el-option>
              <el-option v-for="item in goodsTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货品类别：" prop="FinanceType">
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="item in financeTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条码：" prop="BarCode">
            <el-input name="BarCode" v-model="queryForm.BarCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="款号：" prop="StyleCode">
            <el-input name="StyleCode" v-model="queryForm.StyleCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="货品名称：" prop="GoodsName">
            <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="账面库存：">
            <el-col :span="11">
              <el-form-item prop="FinanceQty1" class="inline no-margin">
                <el-input name="FinanceQty1" v-model="queryForm.FinanceQty1" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="FinanceQty2" class="inline no-margin">
                <el-input name="FinanceQty2" v-model="queryForm.FinanceQty2" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="入库日期：" prop="CreateTime">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="最近销售日期：" prop="LastRetailTime">
            <el-date-picker name="LastRetailTime" v-model="queryForm.LastRetailTime" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-10">
      <el-button name="btnDownLoadData" type="primary" @click="ExportVisible = true" v-if="data.length">导出</el-button>
      <div class="tip">
        <b>高周转：</b>最近销售日期距今少于半年&emsp;&emsp;
        <b>低周转：</b>最近销售日期距今超过半年&emsp;
        <b>未周转：</b>从未销售<br>
        <b>有效库存：</b>最近销售日期距今少于一年&emsp;
        <b>无效库存：</b>最近销售日期距今超过一年
      </div>
    </el-row>
    <div class="p-l-10 p-r-10">
      <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="BarCode" label="条码" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
        <el-table-column prop="StyleCode" label="款号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsTypeName" label="货品类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" sortable="custom" label="入库日期" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.CreateTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="LastRetailTime" sortable="custom" label="最近销售日期" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.LastRetailTime | filterDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="SellStock" label="周转情况" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ValidStock" label="库存状态" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
    </div>
    
    <base-export-field-setter
      @submit="downLoadData"
      :title="'导出'"
      :visible.sync="ExportVisible"
      :items="ExportColumns"
      :props="{key: 'FieldEnName', label: 'FieldCnName'}"
    />
  </el-row>
</template>

<script>
import pagination from '@/components/pagination'
import {
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL,
  STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYBESTSELL
} from '@/apis/stocking'
import {
  ReportStockTurnType,
  ReportStockTurnStatus,
  GoodsType,
  FinanceType,
  StockCompareType,
} from '@/enums/stocking'
import {
  YNStatus
} from '@/enums/common'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
export default {
  data() {
    return {
      stockTurnTypes: {
      },
      stockTurnStatus: {
      },
      goodsTypes: {
      },
      financeTypes: {
      },
      stockCompareTypes: {
      },
      queryForm: {
        StockCompareType: 0,
        FinanceQty1: '',
        FinanceQty2: '',
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        FinanceType: 0,
        GoodsType: 0,
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        CreateTime: [],
        LastRetailTime: [],
        TurnType: '所有情况',
        TurnStatus: '所有状态',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      queryRules: {
        FinanceQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入非负数字'))
              } else if (
                this.queryForm.FinanceQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.FinanceQty2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        FinanceQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入非负数字'))
              } else if (
                this.queryForm.FinanceQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.FinanceQty1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      data: [],
      total: 0,
      ExportVisible: false, // 导出弹窗
      ExportColumns: [
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码',
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号',
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称',
        },
        {
          FieldEnName: 'GoodsTypeName',
          FieldCnName: '货品类型',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存',
        },
        {
          FieldEnName: 'CreateTime',
          FieldCnName: '入库日期',
        },
        {
          FieldEnName: 'LastRetailTime',
          FieldCnName: '最近销售日期',
        },
        {
          FieldEnName: 'SellStock',
          FieldCnName: '周转情况',
        },
        {
          FieldEnName: 'ValidStock',
          FieldCnName: '库存状态',
        },
      ]
    }
  },
  methods: {
    getData() {
      let createTime =  this.queryForm.CreateTime && this.queryForm.CreateTime.length ? this.queryForm.CreateTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      let LastRetailTime = this.queryForm.LastRetailTime && this.queryForm.LastRetailTime.length ? this.queryForm.LastRetailTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      this.$store.commit('SET_TB_LOADING', true)
      this.queryForm = Object.assign(this.queryForm, this.parameters, {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        LastRetailTime1: LastRetailTime[0],
        LastRetailTime2: LastRetailTime[1],
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL(
        this.queryForm
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    pageChange(val) {
      this.parameters.PageIndex = val
      this.getData()
    },
    pageSizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    sortChange(sort) {
      // 0=入库日期 1==条码 2==款号 3==最近销售日期
      switch (sort.prop) {
        case 'LastRetailTime':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'BarCode':
          this.queryForm.OrderBy = 2
          break
        case 'StyleCode':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.queryForm.PageIndex = 1
          this.parameters = JSON.parse(JSON.stringify(this.queryForm))
          this.getData()
        }
      })
    },
    onReset() {
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    downLoadData(fields) {
      let createTime =  this.queryForm.CreateTime && this.queryForm.CreateTime.length ? this.queryForm.CreateTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      let LastRetailTime = this.queryForm.LastRetailTime && this.queryForm.LastRetailTime.length ? this.queryForm.LastRetailTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYBESTSELL(
        { ...this.queryForm, 
          PageIndex: 1,
          PageSize: 0,
          CreateTime1: createTime[0],
          CreateTime2: createTime[1],
          LastRetailTime1: LastRetailTime[0],
          LastRetailTime2: LastRetailTime[1],
          FinanceQty1: this.queryForm.FinanceQty1 ? this.queryForm.FinanceQty1 * 1 : 0,
          FinanceQty2: this.queryForm.FinanceQty2 ? this.queryForm.FinanceQty2 * 1 : 0,
          ExportUserId: this.$store.getters.user_session.UserId,
          ExportUser: this.$store.getters.user_session.TrueName,
          ExportCharacterId: this.$store.getters.user_session.CharacterId,
          ExportColumns	: fields,
        }
      ).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (this.total2 > 10000) {
            this.$confirm(
              '数据量较大，导出任务在后台执行，请稍后到“我的下载”去下载',
              '提示',
              {
                confirmButtonText: '关闭',
                showCancelButton: false,
                type: 'warning'
              }
            )
            return false
          }
          window.open(
            this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
          )
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  beforeMount() {
    this.stockTurnTypes = ReportStockTurnType
    this.stockTurnStatus = ReportStockTurnStatus
    this.goodsTypes = GoodsType
    this.financeTypes = FinanceType
    this.stockCompareTypes = StockCompareType
  },
  mounted() {
    this.getData()
  },
  watch: {
  },
  components: {
    pagination,
    baseExportFieldSetter
  }
}
</script>

<style lang="scss" scoped>
.tip {
  float: right;
  line-height: 18px;
  b {
    font-weight: 700;
  }
}
</style>
