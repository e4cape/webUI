<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" :rules="queryRules" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button @click="ExportVisible = true">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in junkTraceState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="JunkCode">
            <el-input v-model="queryForm.JunkCode" :maxlength="50" placeholder="旧货编号" @keyup.enter.native="onSearch" name="junkCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="JunkCode" label="旧货编号：">
            <el-input v-model="queryForm.JunkCode" :maxlength="50" @keyup.enter.native="onSearch" name="junkCode"></el-input>
          </el-form-item>
          <el-form-item prop="JunkName" label="旧货名称：">
            <el-input v-model="queryForm.JunkName" :maxlength="50" @keyup.enter.native="onSearch" name="junkName"></el-input>
          </el-form-item>
          <el-form-item label="金重：">
            <el-col :span="11">
              <el-form-item prop="GoldWeight1" class="inline no-margin">
                <el-input v-model="queryForm.GoldWeight1" :maxlength="9" @keyup.native="queryForm.GoldWeight1 = $root.toFixed(queryForm.GoldWeight1, 2)" name="goldWeight1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="GoldWeight2" class="inline no-margin">
                <el-input v-model="queryForm.GoldWeight2" :maxlength="9" @keyup.native="queryForm.GoldWeight2 = $root.toFixed(queryForm.GoldWeight2, 2)" name="goldWeight2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="回收金价：">
            <el-col :span="11">
              <el-form-item prop="RecallGoldPrice1" class="inline no-margin">
                <el-input v-model="queryForm.RecallGoldPrice1" :maxlength="9" @keyup.native="queryForm.RecallGoldPrice1 = $root.toFixed(queryForm.RecallGoldPrice1, 2)" name="recallGoldPrice1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="RecallGoldPrice2" class="inline no-margin">
                <el-input v-model="queryForm.RecallGoldPrice2" :maxlength="9" @keyup.native="queryForm.RecallGoldPrice2 = $root.toFixed(queryForm.RecallGoldPrice2, 2)" name="recallGoldPrice2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="回收金额：">
            <el-col :span="11">
              <el-form-item prop="RecallPrice1" class="inline no-margin">
                <el-input v-model="queryForm.RecallPrice1" :maxlength="9" @keyup.native="queryForm.RecallPrice1 = $root.toFixed(queryForm.RecallPrice1, 2)" name="recallPrice1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="RecallPrice2" class="inline no-margin">
                <el-input v-model="queryForm.RecallPrice2" :maxlength="9" @keyup.native="queryForm.RecallPrice2 = $root.toFixed(queryForm.RecallPrice2, 2)" name="recallPrice2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="回收时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" :picker-options="$root.datePickerOptions" name="checkTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="会员ID：" prop="MemberId">
            <el-input v-model="queryForm.MemberId" :maxlength="50" @keyup.enter.native="onSearch" name="mamberId"></el-input>
          </el-form-item>
          <el-form-item label="会员手机：" prop="Mobile">
            <el-input v-model="queryForm.Mobile" :maxlength="50" @keyup.enter.native="onSearch" name="mobile"></el-input>
          </el-form-item>
          <el-form-item label="出库类型" prop="VaryType">
            <el-select v-model="queryForm.VaryType" filterable placeholder="出库类型" name="VaryType">
              <el-option label="所有类型" value="0"></el-option>
              <el-option v-for="(item,index) in junkTraceVaryType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="旧货来源：" prop="SourceType">
            <el-select v-model="queryForm.SourceType" placeholder="旧货来源" :filterable="true" name="sourceType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item, index) in junkBasicSourceType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类型：" prop="IsGold">
            <el-select v-model="queryForm.IsGold" placeholder="所有类型" :filterable="true" name="isGold">
              <el-option label="所有类型" value="0"></el-option>
              <el-option v-for="(item, index) in YNStatus.Types" :key="index" :label="item=='是'?'素金':'非素'" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="characterType == CharacterType.Company" label="所有位置：" prop="Position">
            <!-- <el-select v-model="WarehouseId" @change="changeHouse" placeholder="所有位置" :filterable="true" name="isGold">
              <el-option label="所有位置" value="0"></el-option>
              <template v-for="(item, index) in getStoHou($store.getters.wareHouses, $store.getters.stores)">
                <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select> -->
            <el-cascader
              expand-trigger="click"
              :show-all-levels="false"
              :options="getStoHou($store.getters.wareHouses, $store.getters.stores)"
              v-model="queryForm.Position"
              @change="handleChange"
              name="Position">
            </el-cascader>
          </el-form-item>
          <el-form-item label="所有材质：" prop="MaterialType">
            <el-select v-model="queryForm.MaterialType" placeholder="所有材质" :filterable="true" name="materialType">
              <el-option label="所有材质" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有品类：" prop="CategoryType">
            <el-select v-model="queryForm.CategoryType" placeholder="所有品类" :filterable="true" name="categoryType">
              <el-option label="所有品类" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有成色：" prop="GoldType">
            <el-select v-model="queryForm.GoldType" placeholder="所有成色" :filterable="true" name="goldType">
              <el-option label="所有成色" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-row class="checkPage-hd">
      <el-col :span="24" class="tr">
        <span class="detail-info-num-item">
          总件数：
          <b class="num">{{total}}</b>
        </span>
        <span class="detail-info-num-item">
          总金重：
          <b class="num">{{$root.toFloat(detail.TotalGoldWeight, 3)}}g</b>
        </span>
        <span class="detail-info-num-item">
          总金额：
          <b class="num">￥{{$root.toFloat(detail.TotalRecallPrice)}}</b>
        </span>
        <span class="detail-info-num-item">
          总工费：
          <b class="num">￥{{$root.toFloat(detail.TotalRecallFee)}}</b>
        </span>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column prop="JunkCode" label="旧货编号" min-width="90" fixed show-overflow-tooltip></el-table-column>
      <el-table-column prop="JunkName" label="旧货名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="IsGold" label="类型" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.IsGold == YNStatus.Yes ?'素金':'非素'}}</template>
      </el-table-column>
      <el-table-column prop="MaterialType" label="材质" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">{{$store.getters.materialType.Types[scope.row.MaterialType]}}</template>
      </el-table-column>
      <el-table-column prop="CategoryType" label="品类" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$store.getters.categoryType.Types[scope.row.CategoryType]}}</template>
      </el-table-column>
      <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
      </el-table-column>
      <el-table-column prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.RecallGoldPrice)}}</template>
      </el-table-column>
      <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.RecallPrice)}}</template>
      </el-table-column>
      <el-table-column prop="RecallFee" label="回收工费(元)" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.RecallFee)}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="回收时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="MemberId" label="会员ID" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Mobile" label="会员手机号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SourceType" label="来源" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{junkBasicSourceType.Types[scope.row.SourceType]}}</template>
      </el-table-column>
      <el-table-column v-if="characterType == CharacterType.Company" prop="UnitedName" label="位置" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.UnitedName}}</template>
      </el-table-column>
      <!-- <el-table-column prop="VaryType" label="转换类型" min-width="80" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">{{junkTraceVaryType.Types[scope.row.VaryType]}}</template>
      </el-table-column> -->
      <el-table-column prop="State" label="状态" min-width="80" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.State | findKey(junkTraceState)">
            {{junkTraceState.Types[scope.row.State]}}{{junkTraceVaryType.Types[scope.row.VaryType]?'('+junkTraceVaryType.Types[scope.row.VaryType]+')':''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.IsGold !== YNStatus.No" type="text" @click="checkGold({'type': true, id: scope.row.JunkId, CharacterId: scope.row.StorechterId?scope.row.StorechterId:scope.row.CompchterId})" name="btnCheckGold">查看</el-button>
          <el-button v-if="scope.row.IsGold === YNStatus.No" type="text" @click="checkGold({'type': false, id: scope.row.JunkId, CharacterId: scope.row.StorechterId?scope.row.StorechterId:scope.row.CompchterId})" name="btnCheckGold">查看</el-button>
          <el-button type="text" @click="showPrint(scope.row.JunkId)" name="btnPrint">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="getExportColumns(ExportColumns)" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
    <!-- end 导出 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({GoodsId: goodsId}))" :printingType="settingPrintingType.StockingCloudJunkPrintOrderBasic"></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  JunkTraceState,
  JunkTraceVaryType,
  JunkBasicSourceType
} from '@/enums/stocking.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_TRACE_GETS,
  STOCKING_API_JUNK_TRACE_GETSTOTAL,
  STOCKING_API_JUNK_TRACE_EXPORT
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goldCheck from '@/components/erp/goldCheck.vue'
// import exportGoods from '@/components/erp/exportGoods.vue'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import exportGoodsDetail from '@/components/erp/exportGoodsDetail'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      junkTraceState: JunkTraceState,
      junkTraceVaryType: JunkTraceVaryType,
      junkBasicSourceType: JunkBasicSourceType,
      settingPrintingType: SettingPrintingType,
      detail: {},
      total: 0,
      queryForm: {
        JunkId: '0',
        SourceType: '0', // 来源类型(枚举)
        IsGold: '0', // 是否素金
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        GoldType: '0', // 成色(枚举)
        JunkCode: '', // 旧货编号
        JunkName: '', // 旧货名称
        WarehouseId: '0',
        StorechterId: '-1',
        Position: [0],
        VaryType: '0',
        StoreBarCode: '', // 门店条码
        GoldWeight1: '', // 金重
        GoldWeight2: '', // 金重
        RecallGoldPrice1: '', // 回收金价(元/g)
        RecallGoldPrice2: '', // 回收金价(元/g)
        RecallPrice1: '', // 回收金额
        RecallPrice2: '', // 回收金额
        CreateTime: [], // 创建时间
        CreateTime1: '', // 创建时间
        CreateTime2: '', // 创建时间
        MemberId: '', // 会员序号
        MemberCode: '', // 会员Id
        Mobile: '', // 会员手机
        State: '1', // 旧货状态(枚举)
        OrderBy: '1', // 排序字段(0=创建时间)
        IsAsced: YNStatus.No, // 是否升序
        PageIndex: 1, // 当前页码
        PageSize: 20, // 每页?条
      },
      exportValue: [],
      rightBox: [],
      WarehouseOpt: [0], // 所有位置
      createDialog: false,
      createDialog2: false,
      checkDialog: false,
      printDialog: false,
      exportDialog: false,
      ExportVisible: false,
      exportType: YNStatus.No,
      ExportColumns: [
        {
          FieldEnName: 'JunkCode',
          FieldCnName: '旧货编号',
        },
        {
          FieldEnName: 'JunkName',
          FieldCnName: '旧货名称',
        },
        {
          FieldEnName: 'IsGoldName',
          FieldCnName: '类型',
        },
        {
          FieldEnName: 'MaterialTypeName',
          FieldCnName: '材质',
        },
        {
          FieldEnName: 'CategoryTypeName',
          FieldCnName: '品类',
        },
        {
          FieldEnName: 'GoldTypeName',
          FieldCnName: '成色',
        },
        {
          FieldEnName: 'GoldWeight',
          FieldCnName: '金重',
          Precision: 3
        },
        {
          FieldEnName: 'RecallGoldPrice',
          FieldCnName: '回收金价',
          Precision: 2
        },
        {
          FieldEnName: 'RecallPrice',
          FieldCnName: '回收金额',
          Precision: 2
        },
        {
          FieldEnName: 'RecallFee',
          FieldCnName: '回收工费',
          Precision: 2
        },
        {
          FieldEnName: 'CreateTime',
          FieldCnName: '回收时间',
        },
        {
          FieldEnName: 'MemberId',
          FieldCnName: '会员ID',
        },
        {
          FieldEnName: 'Mobile',
          FieldCnName: '会员手机号',
        },
        {
          FieldEnName: 'SourceTypeName',
          FieldCnName: '来源',
        },
        {
          FieldEnName: 'UnitedName',
          FieldCnName: '位置',
        },
        {
          FieldEnName: 'StateName',
          FieldCnName: '状态',
        },
      ],
      selections: [], // 选中元素
      goodsId: '', // 打印使用ID
      data: [],
      goldParams: {
        type: true,
        info: {
        }
      },
      checkParams: {
        type: false,
        id: '',
        CharacterId: 0
      },
      queryRules: {
        RecallGoldPrice1: [
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
                this.queryForm.RecallGoldPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.RecallGoldPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        RecallGoldPrice2: [
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
                this.queryForm.RecallGoldPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.RecallGoldPrice1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
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
        RecallPrice1: [
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
                this.queryForm.RecallPrice2 &&
                parseFloat(value) > parseFloat(this.queryForm.RecallPrice2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        RecallPrice2: [
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
                this.queryForm.RecallPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.RecallPrice1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      parameters: {}
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    getExportColumns(data){
      // 门店环境下导出没有位置
      let obj
      if(this.characterType == CharacterType.Store){
        obj = data.filter(item => {return item.FieldEnName != 'UnitedName'})
      }else{
        obj = data
      }
      console.log('obj', obj)
      return obj
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            JunkId: '0',
            SourceType: '0', // 来源类型(枚举)
            IsGold: '0', // 是否素金
            MaterialType: '0', // 材质类型(枚举)
            CategoryType: '0', // 品类(枚举)
            GoldType: '0', // 成色(枚举)
            JunkCode: '', // 旧货编号
            JunkName: '', // 旧货名称
            WarehouseId: '0',
            StorechterId: '-1',
            Position: [0],
            VaryType: '0',
            StoreBarCode: '', // 门店条码
            GoldWeight1: '', // 金重
            GoldWeight2: '', // 金重
            RecallGoldPrice1: '', // 回收金价(元/g)
            RecallGoldPrice2: '', // 回收金价(元/g)
            RecallPrice1: '', // 回收金额
            RecallPrice2: '', // 回收金额
            CreateTime: [], // 创建时间
            CreateTime1: '', // 创建时间
            CreateTime2: '', // 创建时间
            MemberId: '', // 会员序号
            MemberCode: '', // 会员Id
            Mobile: '', // 会员手机
            State: '1', // 旧货状态(枚举)
            OrderBy: '1', // 排序字段(0=创建时间)
            IsAsced: YNStatus.No, // 是否升序
            PageIndex: 1, // 当前页码
            PageSize: 20, // 每页?条
          }
      this.parameters = Object.assign({}, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getDetail(data){
      STOCKING_API_JUNK_TRACE_GETSTOTAL(data).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
        }
      })
    },
    getData() {
      // 获取旧货库存列表
      let checkTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['', '']
      this.$store.commit('SET_TB_LOADING', true)
      let param = {
        CreateTime1: checkTime[0],
        CreateTime2: checkTime[1]
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      this.queryForm.Position = this.queryForm.Position.length === 1 
        ? [parseInt(this.queryForm.Position)] 
        : this.queryForm.Position.map(item => parseInt(item))
      let params = { ...this.queryForm }
      params.RecallGoldPrice1 = this.$root.toInt(params.RecallGoldPrice1)
      params.RecallGoldPrice2 = this.$root.toInt(params.RecallGoldPrice2)
      params.RecallPrice1 = this.$root.toInt(params.RecallPrice1)
      params.RecallPrice2 = this.$root.toInt(params.RecallPrice2)
      params.GoldWeight1 = this.$root.toInt(params.GoldWeight1)
      params.GoldWeight2 = this.$root.toInt(params.GoldWeight2)
      this.getDetail(params)
      console.log('params', params, this.queryForm)
      STOCKING_API_JUNK_TRACE_GETS(params).then(res => {
        let result = res.data
        if (result.Code === 'CORRECT') {
          this.data = result.Data.Rows||[]
          this.total = result.Data.Count||0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      // 排序
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.getData()
    },
    getStoHou(arr1, arr2){
      // return arr1.concat(arr2.filter(item => { return item.State == this.YNStatus.Yes }))
      let arr = [
        {
          value: 0,
          label: '所有位置',
          children: null
        },
        {
          value: 1,
          label: '总部仓库',
          children: []
        },
        {
          value: 2,
          label: '门店',
          children: []
        }
      ]
      let companyArr = [] // 仓库(总部)
      let storeArr = [] // 门店
      arr1.map(item => {
        if(item.State == this.YNStatus.Yes){
          companyArr.push({
            value: item.Id,
            label: item.Value
          })
        }
      })
      arr2.map(item => {
        if(item.State == this.YNStatus.Yes){
          storeArr.push({
            value: item.CharacterId,
            label: item.Value
          })
        }
      })
      arr[1].children = companyArr
      arr[2].children = storeArr
      return arr
    },
    handleChange(val){
      switch(val[0]){
        case 0:
          this.queryForm.WarehouseId = 0
          this.queryForm.StorechterId = -1
          break
        case 1:
          this.queryForm.WarehouseId = Number(val[1])||0
          this.queryForm.StorechterId = -1
          break
        case 2:
          this.queryForm.WarehouseId = 0
          this.queryForm.StorechterId = Number(val[1])||-1
          break
        default:
          this.queryForm.WarehouseId = 0
          this.queryForm.StorechterId = -1
          break
      }
    },
    createVisible(success) {
      // 素金关闭
      this.createDialog = false
      if (success) {
        this.init()
      }
    },
    createVisible2(success) {
      // 非素关闭
      this.createDialog2 = false
      if (success) {
        this.init()
      }
    },
    selectionChange(selection) {
      // 后台接口暂不支持选中导出
      this.selections = selection
      console.log('this.selections', this.selections)
    },
    checkGold(obj) {
      // 查看
      this.checkParams = obj
      this.checkDialog = true
    },
    showPrint(id) {
      this.goodsId = id
      this.printDialog = true
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.$refs.search.validate(valid => {
        if (valid) {
          console.log(110, typeof this.queryForm.State)
          this.parameters = JSON.parse(JSON.stringify(this.queryForm))
          if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
            console.log(111)
            this.getData()
          } else {
            console.log(112)
            this.initRoute()
          }
        }
      })
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.queryForm.WarehouseId = '0'
      this.queryForm.StorechterId = '-1'
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
    listenExportDialog() {
      this.exportDialog = false
    },
    // listenPrintDialog(ExportColumns) {
    //   this.printDialog = false
    //   STOCKING_API_JUNK_TRACE_EXPORT(
    //     Object.assign({}, this.searchData, { ExportColumns: this.ExportColumns })
    //   ).then(res => {
    //     this.$store.commit('SET_FULL_LOADING', false)
    //     if (res.data.Code === 'CORRECT') {
    //       this.visible = false
    //       window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
    //     } else {
    //       this.$message.error(res.data.Message)
    //     }
    //   })
    // },
    downLoadData(column) {
      let obj = { ...this.queryForm }
      console.log('this.queryForm', this.queryForm, 'obj', obj)
      obj.PageIndex = 1
      obj.PageSize = 0
      obj.ExportColumns = column
      obj.JunkId = parseInt(obj.JunkId) || 0
      obj.VaryType = parseInt(obj.VaryType) || 0
      obj.State = parseInt(obj.State) || 0
      obj.SourceType = parseInt(obj.SourceType) || 0
      obj.IsGold = parseInt(obj.IsGold) || 0
      obj.MaterialType = parseInt(obj.MaterialType) || 0
      obj.CategoryType = parseInt(obj.CategoryType) || 0
      obj.GoldType = parseInt(obj.GoldType) || 0
      obj.GoldWeight1 = parseFloat(obj.GoldWeight1) || 0
      obj.GoldWeight2 = parseInt(obj.GoldWeight2) || 0
      obj.RecallGoldPrice1 = parseInt(obj.RecallGoldPrice1) || 0
      obj.RecallGoldPrice2 = parseInt(obj.RecallGoldPrice2) || 0
      obj.RecallPrice1 = parseInt(obj.RecallPrice1) || 0
      obj.RecallPrice2 = parseInt(obj.RecallPrice2) || 0
      obj.CreateUserId = parseInt(obj.CreateUserId) || 0
      obj.WarehouseId = parseInt(obj.WarehouseId) || 0
      obj.StorechterId = parseInt(obj.StorechterId) || -1
      obj.OrderBy = parseInt(obj.OrderBy) || 1
      obj.IsAsced = parseInt(obj.IsAsced) || 1
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_JUNK_TRACE_EXPORT(obj).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code == 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
        this.ExportVisible = false
      }).catch(() => {
        this.ExportVisible = false
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_STORES_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
    },
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    // 'queryForm.VaryType': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    goldCheck,
    printOrder,
    baseExportFieldSetter,
    exportGoodsDetail
  }
}
</script>
<style lang="scss">
.export-wrap {
  .el-button + .el-button,
  .el-button + .el-input,
  .el-button + .el-dropdown,
  .el-button + .el-select {
    margin-left: 0px;
  }
}
</style>

<style lang="scss"  scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.junk_small_input {
  max-width: 45%;
}
.junk_small_center {
  width: 10%;
  text-align: center;
  display: block;
}

.vip-bd .el-input {
  margin-right: 10px;
}

.inventor-title-form {
  width: 100%;
  padding: 5px 20px;
  overflow: hidden;
  .el-dropdown {
    vertical-align: middle;
    margin-left: 10px;
  }
  .left-title {
    margin-top: 3px;
    text-align: left;
  }
  .right-title {
    line-height: 30px;
    text-align: right;
    span {
      margin-right: 10px;
      font-size: 14px;
      b {
        font-size: 16px;
      }
    }
  }
}
@media screen and (max-width: 1460px) {
  .panel-hd.retrive .el-select {
    width: 95px;
  }
}
@media screen and (max-width: 1333px) {
  .panel-hd.retrive .title {
    padding: 0 7px;
  }
}
.block {
  display: block;
}
</style>
