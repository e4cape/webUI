<template>
  <el-row>
    <el-form
      :model="queryForm"
      :rules="queryRules"
      label-width="100px"
      ref="queryForm"
      :inline="true"
      class="item-lh-26 p10"
    >
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="位置：" prop="characterId">
            <el-cascader
              :options="locationData"
              change-on-select
              name="characterId"
              v-model="characterId"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="类别：" prop="FinanceType">
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option
                v-for="(item,index) in financeTypes.Types"
                :key="index"
                :label="item"
                :value="parseInt(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材质：" prop="MaterialType">
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质">
              <el-option label="所有材质" :value="0"></el-option>
              <el-option
                v-for="(item,index) in $store.getters.materialType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="item.Id || item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类">
              <el-option label="所有品类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.categoryType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="item.Id || item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色">
              <el-option label="所有成色" :value="0"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.goldType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="item.Id || item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货重：">
            <el-col :span="11">
              <el-form-item prop="Weight1" class="inline no-margin">
                <el-input
                  name="Weight1"
                  v-model="queryForm.Weight1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="Weight2" class="inline no-margin">
                <el-input
                  name="Weight2"
                  v-model="queryForm.Weight2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="净金重：">
            <el-col :span="11">
              <el-form-item prop="GoldWeight1" class="inline no-margin">
                <el-input
                  name="GoldWeight1"
                  v-model="queryForm.GoldWeight1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="GoldWeight2" class="inline no-margin">
                <el-input
                  name="GoldWeight2"
                  v-model="queryForm.GoldWeight2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="主石重：">
            <el-col :span="11">
              <el-form-item prop="StoneWeight1" class="inline no-margin">
                <el-input
                  name="StoneWeight1"
                  v-model="queryForm.StoneWeight1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="StoneWeight2" class="inline no-margin">
                <el-input
                  name="StoneWeight2"
                  v-model="queryForm.StoneWeight2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="条码：" prop="StoreBarCode">
            <el-input
              name="StoreBarCode"
              v-model="queryForm.StoreBarCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="款号：" prop="StoreStyleNumber">
            <el-input
              name="StoreStyleNumber"
              v-model="queryForm.StoreStyleNumber"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="货品名称：" prop="GoodsName">
            <el-input
              name="GoodsName"
              v-model="queryForm.GoodsName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="零售方式：" prop="RetailType">
            <el-select name="RetailType" v-model="queryForm.RetailType" filterable placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in retailTypes.Types"
                :key="index"
                :label="item"
                :value="parseInt(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毛利：">
            <el-col :span="11">
              <el-form-item prop="ProfitPrice1" class="inline no-margin">
                <el-input
                  name="ProfitPrice1"
                  v-model="queryForm.ProfitPrice1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="ProfitPrice2" class="inline no-margin">
                <el-input
                  name="ProfitPrice2"
                  v-model="queryForm.ProfitPrice2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="毛利率：">
            <el-col :span="11">
              <el-form-item prop="RateProfit1" class="inline no-margin">
                <el-input
                  name="RateProfit1"
                  v-model="queryForm.RateProfit1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="RateProfit2" class="inline no-margin">
                <el-input
                  name="RateProfit2"
                  v-model="queryForm.RateProfit2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="销售日期：" prop="OrderTime">
            <el-date-picker
              name="OrderTime"
              v-model="queryForm.OrderTime"
              type="daterange"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              placeholder="选择日期范围"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="p-10">
      <el-button
        name="btnDownLoadData"
        type="primary"
        @click="ExportVisible = true"
        v-if="data.length"
      >导出</el-button>
    </div>
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
      <el-table-column prop="StoreBarCode" label="条码" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreStyleNumber" label="款号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MaterialTypeName" label="材质" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CategoryTypeName" label="品类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldTypeName" label="成色" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="货重" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="GoldWeight" label="净金重" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="StoneWeight1" label="主石重(g)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.StoneWeight1, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="StoneColor1" label="主石颜色" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stoneColors.Types[scope.row.StoneColor1]}}</template>
      </el-table-column>
      <el-table-column prop="StoneClarity1" label="主石净度" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stoneClaritys.Types[scope.row.StoneClarity1]}}</template>
      </el-table-column>
      <el-table-column prop="RetailTypeName" label="零售方式" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SaleCount" label="销售数量" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.SaleCount}}</template>
      </el-table-column>
      <el-table-column prop="SalePrice" label="销售金额(应付)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.SalePrice)}}</template>
      </el-table-column>
      <el-table-column prop="CostPrice" label="成本金额(元)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.CostPrice)}}</template>
      </el-table-column>
      <el-table-column prop="ProfitPrice" label="毛利" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.ProfitPrice)}}</template>
      </el-table-column>
      <el-table-column prop="RateProfit" label="毛利率" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{(scope.row.RateProfit / 100).toFixed(2)}}%</template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="pageChange"
      @sizeChange="pageSizeChange"
    ></pagination>
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
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import { YNStatus, CharacterType, RangeType } from '@/enums/common'
import { RetailOrderSellProductSourceType } from '@/enums/order'
import {
  StoneColor,
  StoneClarity,
  RetailType,
  FinanceType,
  StockPositionTypeType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_CHARTBYSALELIST2,
  STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST2
} from '@/apis/stocking'
export default {
  data() {
    return {
      characterTypes: CharacterType,
      stoneColors: {},
      stoneClaritys: {},
      retailTypes: {},
      financeTypes: {},
      characterId: [0],
      queryForm: {
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0,
        OrderTime: '',
        StoreBarCode: '',
        StoreStyleNumber: '',
        GoodsName: '',
        RetailType: 0,
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoldWeight1: '',
        GoldWeight2: '',
        FinanceType: 0,
        SourceType: 0,
        Weight1: '',
        Weight2: '',
        StoneWeight1: '',
        StoneWeight2: '',
        ProfitPrice1: '',
        ProfitPrice2: '',
        RateProfit1: '',
        RateProfit2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      queryRules: {
        GoldWeight1: [
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
                this.queryForm.GoldWeight2 &&
                parseFloat(value) > parseFloat(this.queryForm.GoldWeight2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        GoldWeight2: [
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
                this.queryForm.GoldWeight1 &&
                parseFloat(value) < parseFloat(this.queryForm.GoldWeight1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        Weight1: [
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
                this.queryForm.Weight2 &&
                parseFloat(value) > parseFloat(this.queryForm.Weight2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        Weight2: [
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
                this.queryForm.Weight1 &&
                parseFloat(value) < parseFloat(this.queryForm.Weight1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        StoneWeight1: [
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
                this.queryForm.StoneWeight2 &&
                parseFloat(value) > parseFloat(this.queryForm.StoneWeight2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        StoneWeight2: [
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
                this.queryForm.StoneWeight1 &&
                parseFloat(value) < parseFloat(this.queryForm.StoneWeight1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        ProfitPrice1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入要查询的数字'))
              } else if (
                this.queryForm.ProfitPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.ProfitPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        ProfitPrice2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入要查询的数字'))
              } else if (
                this.queryForm.ProfitPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.ProfitPrice1)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        RateProfit1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入要查询的数字'))
              } else if (
                this.queryForm.RateProfit2 &&
                parseFloat(value) > parseFloat(this.queryForm.RateProfit2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        RateProfit2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入要查询的数字'))
              } else if (
                this.queryForm.RateProfit1 &&
                parseFloat(value) < parseFloat(this.queryForm.RateProfit1)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ]
      },
      parameters: {},
      total: 0,
      data: [],
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      ExportVisible: false, // 导出弹窗
      ExportColumns: [
        {
          FieldEnName: 'StoreBarCode',
          FieldCnName: '条码'
        },
        {
          FieldEnName: 'StoreStyleNumber',
          FieldCnName: '款号'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'MaterialTypeName',
          FieldCnName: '材质'
        },
        {
          FieldEnName: 'CategoryTypeName',
          FieldCnName: '品类'
        },
        {
          FieldEnName: 'GoldTypeName',
          FieldCnName: '成色'
        },
        {
          FieldEnName: 'Weight',
          FieldCnName: '货重',
          Precision: 3
        },
        {
          FieldEnName: 'GoldWeight',
          FieldCnName: '净金重',
          Precision: 3
        },
        {
          FieldEnName: 'StoneWeight1',
          FieldCnName: '主石重',
          Precision: 3
        },
        {
          FieldEnName: 'StoneColor1Name',
          FieldCnName: '主石颜色'
        },
        {
          FieldEnName: 'StoneClarity1Name',
          FieldCnName: '主石净度'
        },
        {
          FieldEnName: 'RetailTypeName',
          FieldCnName: '零售方式'
        },
        {
          FieldEnName: 'SaleCount',
          FieldCnName: '销售数量'
        },
        {
          FieldEnName: 'SalePrice',
          FieldCnName: '销售金额(应付)',
          Precision: 2
        },
        {
          FieldEnName: 'CostPrice',
          FieldCnName: '成本金额',
          Precision: 2
        },
        {
          FieldEnName: 'ProfitPrice',
          FieldCnName: '毛利',
          Precision: 2
        },
        {
          FieldEnName: 'RateProfitName',
          FieldCnName: '毛利率',
          Precision: 2
        }
      ]
    }
  },
  props: {
    locationData: {
      type: Array
    }
  },
  methods: {
    returnDeskId(id, id2) {
      if (arguments.length === 1) {
        return id <= 0 ? 0 : id
      } else {
        return id <= 0 && !arguments[1] ? id : !id2 ? -1 : id2
      }
    },
    getData() {
      let orderTime = this.parameters.OrderTime || ['', '']
      let parameter = Object.assign(this.queryForm, this.parameters, {
        OrderTime1: orderTime[0],
        OrderTime2: orderTime[1],
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0,
        SourceType: RetailOrderSellProductSourceType.Stocking
      })
      switch (this.characterId[0]) {
        case StockPositionTypeType.All:
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.ClassifyId = -1
          parameter.DeskId = 0
          break
        case StockPositionTypeType.Store:
          parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.ClassifyId = -1
          parameter.DeskId = 0
          break
        case StockPositionTypeType.UnGroupTypeDk:
          parameter.ClassifyId = 0
          parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          break
        default:
          if (
            this.$store.getters.user_session.CharacterType ==
            CharacterType.Group
          ) {
            parameter.CompchterId = this.characterId[0]
              ? this.characterId[0]
              : 0
            parameter.StorechterId = this.characterId[1]
              ? this.characterId[1]
              : 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else if (
            this.$store.getters.user_session.CharacterType ==
            CharacterType.Company
          ) {
            parameter.CompchterId = 0
            parameter.StorechterId = this.characterId[0]
              ? this.characterId[0]
              : 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else {
            parameter.CompchterId = 0
            parameter.StorechterId = 0
            parameter.ClassifyId = this.characterId[0]
              ? this.characterId[0]
              : -1
            parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          }
          break
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALELIST2({
        ...parameter,
        Weight1: this.$root.toInt(this.parameters.Weight1),
        Weight2: this.$root.toInt(this.parameters.Weight2),
        GoldWeight1: this.$root.toInt(this.parameters.GoldWeight1),
        GoldWeight2: this.$root.toInt(this.parameters.GoldWeight2),
        StoneWeight1: this.$root.toInt(this.parameters.StoneWeight1),
        StoneWeight2: this.$root.toInt(this.parameters.StoneWeight2),
        ProfitPrice1: this.$root.toInt(this.parameters.ProfitPrice1),
        ProfitPrice2: this.$root.toInt(this.parameters.ProfitPrice2),
        RateProfit1: this.$root.toInt(this.parameters.RateProfit1),
        RateProfit2: this.$root.toInt(this.parameters.RateProfit2)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
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
    onSearch() {
      if (
        this.queryForm.ProfitPrice1 == '' &&
        this.queryForm.ProfitPrice2 == ''
      ) {
        this.queryForm.ProfitPriceRangeType = RangeType.All
      } else if (
        this.queryForm.ProfitPrice1 != '' &&
        this.queryForm.ProfitPrice2 == ''
      ) {
        this.queryForm.ProfitPriceRangeType = RangeType.Over
      } else if (
        this.queryForm.ProfitPrice1 == '' &&
        this.queryForm.ProfitPrice2 != ''
      ) {
        this.queryForm.ProfitPriceRangeType = RangeType.Less
      } else {
        this.queryForm.ProfitPriceRangeType = RangeType.Range
      }
      if (
        this.queryForm.RateProfit1 == '' &&
        this.queryForm.RateProfit2 == ''
      ) {
        this.queryForm.RateProfitRangeType = RangeType.All
      } else if (
        this.queryForm.RateProfit1 != '' &&
        this.queryForm.RateProfit2 == ''
      ) {
        this.queryForm.RateProfitRangeType = RangeType.Over
      } else if (
        this.queryForm.RateProfit1 == '' &&
        this.queryForm.RateProfit2 != ''
      ) {
        this.queryForm.RateProfitRangeType = RangeType.Less
      } else {
        this.queryForm.RateProfitRangeType = RangeType.Range
      }
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.parameters = Object.assign({}, this.queryForm, {
            PageIndex: 1
          })
          this.getData()
        }
      })
    },
    onReset() {
      this.characterId = [0]
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    downLoadData(fields) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST2({
        ...this.queryForm,
        PageIndex: 1,
        PageSize: 0,
        Weight1: this.queryForm.Weight1
          ? this.$root.toInt(this.queryForm.Weight1)
          : 0,
        Weight2: this.queryForm.Weight2
          ? this.$root.toInt(this.queryForm.Weight2)
          : 0,
        GoldWeight1: this.queryForm.GoldWeight1
          ? this.$root.toInt(this.queryForm.GoldWeight1)
          : 0,
        GoldWeight2: this.queryForm.GoldWeight2
          ? this.$root.toInt(this.queryForm.GoldWeight2)
          : 0,
        StoneWeight1: this.queryForm.StoneWeight1
          ? this.$root.toInt(this.queryForm.StoneWeight1)
          : 0,
        StoneWeight2: this.queryForm.StoneWeight2
          ? this.$root.toInt(this.queryForm.StoneWeight2)
          : 0,
        ProfitPrice1: this.queryForm.ProfitPrice1
          ? this.$root.toInt(this.queryForm.ProfitPrice1)
          : 0,
        ProfitPrice2: this.queryForm.ProfitPrice2
          ? this.$root.toInt(this.queryForm.ProfitPrice2)
          : 0,
        RateProfit1: this.queryForm.RateProfit1
          ? this.$root.toInt(this.queryForm.RateProfit1)
          : 0,
        RateProfit2: this.queryForm.RateProfit2
          ? this.$root.toInt(this.queryForm.RateProfit2)
          : 0,
        ExportColumns: fields
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (this.total > 10000) {
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
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CATEGORY_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.stoneColors = StoneColor
    this.stoneClaritys = StoneClarity
    this.retailTypes = RetailType
    this.financeTypes = FinanceType
  },
  mounted() {
    this.getData()
  },
  watch: {},
  components: {
    pagination,
    baseExportFieldSetter
  }
}
</script>
