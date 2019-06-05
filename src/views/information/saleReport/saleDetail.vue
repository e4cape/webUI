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
          <el-form-item label="销售来源：" prop="TerminalType">
            <el-select name="TerminalType" v-model="queryForm.TerminalType" placeholder="所有销售来源">
              <el-option label="所有销售来源" :value="0"></el-option>
              <el-option
                v-for="(item,index) in terminalTypes.Types"
                :key="index"
                :label="item"
                :value="parseInt(index)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售时间：" prop="OrderTime">
            <el-date-picker
              name="OrderTime"
              v-model="queryForm.OrderTime"
              type="daterange"
              :clearable="false"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              placeholder="选择日期范围"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="货品类别：" prop="FinanceType">
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option
                v-for="(item,index) in financeTypes.Types"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货品来源：" prop="SourceType">
            <el-select name="SourceType" v-model="queryForm.SourceType" placeholder="所有货品来源">
              <el-option label="所有货品来源" :value="0"></el-option>
              <el-option
                v-for="(item,index) in retailOrderSellProductSourceTypes.Types"
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
          <el-form-item label="大类：" prop="LargeClassTypeEk">
            <el-select
              name="LargeClassTypeEk"
              v-model="queryForm.LargeClassTypeEk"
              placeholder="所有大类"
            >
              <el-option label="所有大类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in largeClassTypes"
                :key="index"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小类：" prop="SmallClassTypeEk">
            <el-select
              name="SmallClassTypeEk"
              v-model="queryForm.SmallClassTypeEk"
              placeholder="所有小类"
            >
              <el-option label="所有小类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in smallClassTypes"
                :key="index"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="财务分类：" prop="FinanceClassTypeEk">
            <el-select
              name="FinanceClassTypeEk"
              v-model="queryForm.FinanceClassTypeEk"
              placeholder="所有分类"
            >
              <el-option label="所有分类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in financeClassTypes"
                :key="index"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系列：" prop="SeriesTypeEk">
            <el-select name="SeriesTypeEk" v-model="queryForm.SeriesTypeEk" placeholder="所有系列">
              <el-option label="所有系列" :value="0"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.seriesType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="石类：" prop="StoneClassTypeEk">
            <el-select
              name="StoneClassTypeEk"
              v-model="queryForm.StoneClassTypeEk"
              placeholder="所有石类"
            >
              <el-option label="所有石类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in $store.getters.stone.TypeArray"
                :key="index"
                :label="item.Value"
                :value="item.Id"
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
          <el-form-item
            v-if="$store.getters.user_session.CharacterType == characterTypes.Store"
            label="收银员："
            prop="CashierUserId"
          >
            <el-select name="CashierUserId" v-model="queryForm.CashierUserId" placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in cashier"
                :key="index"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="$store.getters.user_session.CharacterType == characterTypes.Store"
            label="主销导购："
            prop="MainUserId"
          >
            <el-select name="MainUserId" v-model="queryForm.MainUserId" placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in employee"
                :key="index"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="$store.getters.user_session.CharacterType == characterTypes.Store"
            label="辅销导购："
            prop="AssistUserId"
          >
            <el-select name="AssistUserId" v-model="queryForm.AssistUserId" placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in employee"
                :key="index"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签价：">
            <el-col :span="11">
              <el-form-item prop="LabelPrice1" class="inline no-margin">
                <el-input
                  name="LabelPrice1"
                  v-model="queryForm.LabelPrice1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="LabelPrice2" class="inline no-margin">
                <el-input
                  name="LabelPrice2"
                  v-model="queryForm.LabelPrice2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="应付金额：">
            <el-col :span="11">
              <el-form-item prop="ProductPrice1" class="inline no-margin">
                <el-input
                  name="ProductPrice1"
                  v-model="queryForm.ProductPrice1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="ProductPrice2" class="inline no-margin">
                <el-input
                  name="ProductPrice2"
                  v-model="queryForm.ProductPrice2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="实付金额：">
            <el-col :span="11">
              <el-form-item prop="CashPrice1" class="inline no-margin">
                <el-input
                  name="CashPrice1"
                  v-model="queryForm.CashPrice1"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="CashPrice2" class="inline no-margin">
                <el-input
                  name="CashPrice2"
                  v-model="queryForm.CashPrice2"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-10">
      <el-button
        name="btnDownLoadData"
        type="primary"
        @click="ExportVisible = true"
        v-if="data.length"
      >导出</el-button>
    </el-row>
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
      <el-table-column
        prop="OrderTime"
        label="销售时间"
        min-width="150"
        sortable="custom"
        show-overflow-tooltip
        fixed
      >
        <template slot-scope="scope">{{scope.row.OrderTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="StoreBarCode" label="条码" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="StoreStyleNumber" label="款号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MaterialTypeName" label="材质" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CategoryTypeName" label="品类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldTypeName" label="成色" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LargeClassTypeEv" label="大类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SmallClassTypeEv" label="小类" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.SmallClassTypeEv
            ? scope.row.SmallClassTypeEv
              : (smallClassTypes.find(val => val.Id === scope.row.SmallClassTypeEk)
                ? smallClassTypes.find(val => val.Id === scope.row.SmallClassTypeEk).Value
                : '')}}
        </template>
      </el-table-column>
      <el-table-column prop="FinanceClassTypeEv" label="财务分类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SeriesTypeEv" label="系列" min-width="120" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.SeriesTypeEv ? scope.row.SeriesTypeEv : $store.getters.seriesType.Types[scope.row.SeriesTypeEk]}}</template>
      </el-table-column>
      <el-table-column prop="StoneClassTypeEv" label="石类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="货重" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="GoldWeight" label="净金重" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="StoneColor1" label="主石颜色" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stoneColors.Types[scope.row.StoneColor1]}}</template>
      </el-table-column>
      <el-table-column prop="StoneClarity1" label="主石净度" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stoneClaritys.Types[scope.row.StoneClarity1]}}</template>
      </el-table-column>
      <el-table-column prop="StoneCut1" label="主石切工" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{stoneCuts.Types[scope.row.StoneCut1]}}</template>
      </el-table-column>
      <el-table-column prop="CertSeriesID" label="证书号" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SellCode" label="销售单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="RetailTypeName" label="零售方式" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LabelPrice" label="标签价" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.LabelPrice)}}</template>
      </el-table-column>
      <el-table-column prop="Discount" label="折扣" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{(scope.row.Discount / 100).toFixed(2)}}%</template>
      </el-table-column>
      <el-table-column prop="DiscPrice" label="优惠" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.DiscPrice)}}</template>
      </el-table-column>
      <el-table-column prop="SalePrice" label="应付金额" width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.SalePrice)}}</template>
      </el-table-column>
      <el-table-column prop="CashPrice" label="实付金额" width="120" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.CashPrice)}}</template>
      </el-table-column>
      <el-table-column prop="CashierUser" label="收银员" min-width="120" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          {{cashier.find(item => item.UserId === scope.row.CashierUserId).TrueName}}
        </template>-->
      </el-table-column>
      <el-table-column prop="MainUser" label="主销导购" min-width="120" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          {{employee.find(item => item.UserId === scope.row.MainUserId).TrueName}}
        </template>-->
      </el-table-column>
      <el-table-column prop="AssistUser" label="辅销导购" min-width="120" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          {{employee.find(item => item.UserId === scope.row.AssistUserId).TrueName}}
        </template>-->
      </el-table-column>
      <el-table-column prop="MemberId" label="会员ID" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TrueName" label="会员姓名" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.TrueName || scope.row.AliasName}}</template>
      </el-table-column>
      <el-table-column prop="Birthday" label="会员生日" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.Birthday | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="Mobile" label="会员手机" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Score" label="赠送积分" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldenRice" label="赠送礼金" min-width="100" show-overflow-tooltip></el-table-column>
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
import { CharacterType, TerminalType, YNStatus } from '@/enums/common'
import { RetailOrderSellProductSourceType } from '@/enums/order'
import { SecurityUserCashierType } from '@/enums/merchant'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant'
import {
  FinanceType,
  RetailType,
  StockPositionTypeType,
  StoneColor,
  StoneClarity,
  StoneCut,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_CHARTBYSALELIST,
  STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
export default {
  data() {
    return {
      characterTypes: {},
      financeTypes: {},
      terminalTypes: {},
      retailOrderSellProductSourceTypes: {},
      stoneColors: {},
      stoneClaritys: {},
      stoneCuts: {},
      retailTypes: {},
      largeClassTypes: [],
      smallClassTypes: [],
      financeClassTypes: [],
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
        LabelPrice1: [
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
                this.queryForm.LabelPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.LabelPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        LabelPrice2: [
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
                this.queryForm.LabelPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.LabelPrice1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        ProductPrice1: [
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
                this.queryForm.ProductPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.ProductPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        ProductPrice2: [
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
                this.queryForm.ProductPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.ProductPrice1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        CashPrice1: [
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
                this.queryForm.CashPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.CashPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        CashPrice2: [
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
                this.queryForm.CashPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.CashPrice1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      queryForm: {
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0,
        CashierUserId: 0,
        MainUserId: 0,
        AssistUserId: 0,
        GuiderUserId: 0,
        OrderTime: '',
        StoreBarCode: '',
        StoreStyleNumber: '',
        GoodsName: '',
        TerminalType: 0,
        SourceType: 0,
        FinanceType: 0,
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        LargeClassTypeEk: 0,
        SmallClassTypeEk: 0,
        FinanceClassTypeEk: 0,
        SeriesTypeEk: 0,
        StoneClassTypeEk: 0,
        GoldWeight1: '',
        GoldWeight2: '',
        LabelPrice1: '',
        LabelPrice2: '',
        ProductPrice1: '',
        ProductPrice2: '',
        CashPrice1: '',
        CashPrice2: '',
        Weight1: '',
        Weight2: '',
        StoneWeight1: '',
        StoneWeight2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {},
      characterId: [0],
      total: 0,
      data: [],
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      cashier: [],
      employee: [],
      ExportVisible: false, // 导出弹窗
      ExportColumns: [
        {
          FieldEnName: 'OrderTime',
          FieldCnName: '销售时间'
        },
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
          FieldEnName: 'LargeClassTypeEv',
          FieldCnName: '大类'
        },
        {
          FieldEnName: 'SmallClassTypeEv',
          FieldCnName: '小类'
        },
        {
          FieldEnName: 'FinanceClassTypeEv',
          FieldCnName: '财务分类'
        },
        {
          FieldEnName: 'SeriesTypeEv',
          FieldCnName: '系列'
        },
        {
          FieldEnName: 'StoneClassTypeEv',
          FieldCnName: '石类'
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
          FieldEnName: 'StoneColor1Name',
          FieldCnName: '主石颜色'
        },
        {
          FieldEnName: 'StoneClarity1Name',
          FieldCnName: '主石净度'
        },
        {
          FieldEnName: 'StoneCut1Name',
          FieldCnName: '主石切工'
        },
        {
          FieldEnName: 'CertSeriesID',
          FieldCnName: '证书号'
        },
        {
          FieldEnName: 'SellCode',
          FieldCnName: '销售单号'
        },
        {
          FieldEnName: 'RetailTypeName',
          FieldCnName: '零售方式'
        },
        {
          FieldEnName: 'LabelPrice',
          FieldCnName: '标签价',
          Precision: 2
        },
        {
          FieldEnName: 'Discount',
          FieldCnName: '折扣',
          Precision: 2
        },
        {
          FieldEnName: 'DiscPrice',
          FieldCnName: '优惠',
          Precision: 2
        },
        {
          FieldEnName: 'SalePrice',
          FieldCnName: '应付金额',
          Precision: 2
        },
        {
          FieldEnName: 'CashPrice',
          FieldCnName: '实付金额',
          Precision: 2
        },
        {
          FieldEnName: 'CashierUser',
          FieldCnName: '收银员'
        },
        {
          FieldEnName: 'MainUser',
          FieldCnName: '主销导购'
        },
        {
          FieldEnName: 'AssistUser',
          FieldCnName: '辅销导购'
        },
        {
          FieldEnName: 'MemberId',
          FieldCnName: '会员ID'
        },
        {
          FieldEnName: 'TrueName',
          FieldCnName: '会员姓名'
        },
        {
          FieldEnName: 'Birthday',
          FieldCnName: '会员生日'
        },
        {
          FieldEnName: 'Mobile',
          FieldCnName: '会员手机'
        },
        {
          FieldEnName: 'Score',
          FieldCnName: '赠送积分'
        },
        {
          FieldEnName: 'GoldenRice',
          FieldCnName: '赠送礼金'
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
    getData() {
      let orderTime = this.parameters.OrderTime || ['', '']
      let parameter = Object.assign(this.queryForm, this.parameters, {
        OrderTime1: orderTime[0],
        OrderTime2: orderTime[1],
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
          if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
            parameter.CompchterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
            parameter.StorechterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.CompchterId = 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else {
            parameter.CompchterId = 0
            parameter.StorechterId = 0
            parameter.ClassifyId = this.characterId[0] ? this.characterId[0] : -1
            parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          }
          break
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALELIST({
        ...parameter,
        Weight1: this.$root.toInt(this.parameters.Weight1),
        Weight2: this.$root.toInt(this.parameters.Weight2),
        GoldWeight1: this.$root.toInt(this.parameters.GoldWeight1),
        GoldWeight2: this.$root.toInt(this.parameters.GoldWeight2),
        StoneWeight1: this.$root.toInt(this.parameters.StoneWeight1),
        StoneWeight2: this.$root.toInt(this.parameters.StoneWeight2),
        LabelPrice1: this.$root.toInt(this.parameters.LabelPrice1),
        LabelPrice2: this.$root.toInt(this.parameters.LabelPrice2),
        ProductPrice1: this.$root.toInt(this.parameters.ProductPrice1),
        ProductPrice2: this.$root.toInt(this.parameters.ProductPrice2),
        CashPrice1: this.$root.toInt(this.parameters.CashPrice1),
        CashPrice2: this.$root.toInt(this.parameters.CashPrice2)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      this.queryForm.OrderBy = 0
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
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.queryForm.PageIndex = 1
          this.parameters = Object.assign({}, this.queryForm)
          this.getData()
        }
      })
    },
    onReset() {
      this.characterId = [0]
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    // 导出数据
    downLoadData(fields) {
      let orderTime = this.parameters.OrderTime || ['', ''] // 明细的时间
      this.$store.commit('SET_FULL_LOADING', true)
      let parameter = Object.assign(this.queryForm, this.parameters, {
        OrderTime1: orderTime[0],
        OrderTime2: orderTime[1],
        PageIndex: 1
      })
      switch (this.characterId[0]) {
        case StockPositionTypeType.All:
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.ClassifyId = -1
          parameter.DeskId = 0
          break
        case StockPositionTypeType.Company:
          parameter.CompchterId = this.characterId[1] ? this.characterId[1] : 0
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
          parameter.ClassifyId = this.characterId[0] ? this.characterId[0] : 0
          parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          break
      }
      STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST({
        ...parameter,
        PageSize: 0,
        Weight1: this.queryForm.Weight1
          ? this.$root.toInt(this.queryForm.Weight1)
          : 0,
        Weight2: this.queryForm.Weight2
          ? this.$root.toInt(this.queryForm.Weight2)
          : 0,
        CashPrice1: this.queryForm.CashPrice1
          ? this.$root.toInt(this.queryForm.CashPrice1)
          : 0,
        CashPrice2: this.queryForm.CashPrice2
          ? this.$root.toInt(this.queryForm.CashPrice2)
          : 0,
        GoldWeight1: this.queryForm.GoldWeight1
          ? this.$root.toInt(this.queryForm.GoldWeight1)
          : 0,
        GoldWeight2: this.queryForm.GoldWeight2
          ? this.$root.toInt(this.queryForm.GoldWeight2)
          : 0,
        LabelPrice1: this.queryForm.LabelPrice1
          ? this.$root.toInt(this.queryForm.LabelPrice1)
          : 0,
        LabelPrice2: this.queryForm.LabelPrice2
          ? this.$root.toInt(this.queryForm.LabelPrice2)
          : 0,
        ProductPrice1: this.queryForm.ProductPrice1
          ? this.$root.toInt(this.queryForm.ProductPrice1)
          : 0,
        ProductPrice2: this.queryForm.ProductPrice2
          ? this.$root.toInt(this.queryForm.ProductPrice2)
          : 0,
        StoneWeight1: this.queryForm.StoneWeight1
          ? this.$root.toInt(this.queryForm.StoneWeight1)
          : 0,
        StoneWeight2: this.queryForm.StoneWeight2
          ? this.$root.toInt(this.queryForm.StoneWeight2)
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
          setTimeout(() => {
            window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
          }, 1000)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getLargeClass() {
      // 大类
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.LargeClassType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.largeClassTypes = res.data.Data.Rows || []
        }
      })
    },
    getSmallClass() {
      // 小类
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.SmallClassType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.smallClassTypes = res.data.Data.Rows || []
        }
      })
    },
    getFinanceClass() {
      // 财务分类
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.FinanceClassType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.financeClassTypes = res.data.Data.Rows || []
        }
      })
    }
  },
  created() {
    // 导购
    this.$store
      .dispatch('GET_USERS_DROPLIST', {
        UserState: 0,
        CashierType: SecurityUserCashierType.Employee
      })
      .then(res => {
        this.employee = res
      })
    // 收银员
    this.$store
      .dispatch('GET_USERS_DROPLIST', {
        UserState: 0,
        CashierType: SecurityUserCashierType.Cashier
      })
      .then(res => {
        this.cashier = res
      })
    this.$store.dispatch('GET_KIND_TYPE')
    this.$store.dispatch('GET_SERIES_TYPE')
    this.$store.dispatch('GET_STONE_TYPE')
    this.getLargeClass()
    this.getSmallClass()
    this.getFinanceClass()
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.financeTypes = FinanceType
    this.terminalTypes = TerminalType
    this.retailOrderSellProductSourceTypes = RetailOrderSellProductSourceType
    this.stoneColors = StoneColor
    this.stoneClaritys = StoneClarity
    this.stoneCuts = StoneCut
    this.retailTypes = RetailType
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
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
