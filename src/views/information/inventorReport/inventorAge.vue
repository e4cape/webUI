<template>
  <el-row>
    <el-form :model="queryForm" :rules="queryRules" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="位置：" prop="characterId" v-if="$store.getters.user_session.CharacterType !== characterTypes.Store">
            <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="库龄(天)：">
            <el-col :span="11">
              <el-form-item prop="StockAge1" class="inline no-margin">
                <el-input name="StockAge1" v-model="queryForm.StockAge1" :maxlength="9" @keyup.native="queryForm.StockAge1 = $root.toFixed(queryForm.StockAge1, 2)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="StockAge2" class="inline no-margin">
                <el-input name="StockAge2" v-model="queryForm.StockAge2" :maxlength="9" @keyup.native="queryForm.StockAge2 = $root.toFixed(queryForm.StockAge2, 2)"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="销售状态：" prop="SellType">
            <el-select name="SellType" v-model="queryForm.SellType" placeholder="所有状态">
              <el-option label="所有状态" value="所有状态"></el-option>
              <el-option label="有销售" value="有销售"></el-option>
              <el-option label="未销售" value="未销售"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材质：" prop="MaterialType">
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质">
              <el-option label="所有材质" :value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类">
              <el-option label="所有品类" :value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色">
              <el-option label="所有成色" :value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
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
          <el-form-item label="库存：" prop="StockCompareType">
            <el-select name="StockCompareType" v-model="queryForm.StockCompareType" placeholder="所有库存">
              <el-option label="所有库存" :value="0"> </el-option>
              <el-option v-for="item in stockCompareTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"> </el-option>
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
                <el-input name="FinanceQty1" v-model="queryForm.FinanceQty1" :maxlength="9"  @keyup.native="queryForm.FinanceQty1 = $root.toFixed(queryForm.FinanceQty1, 2)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="FinanceQty2" class="inline no-margin">
                <el-input name="FinanceQty2" v-model="queryForm.FinanceQty2" :maxlength="9"  @keyup.native="queryForm.FinanceQty2 = $root.toFixed(queryForm.FinanceQty2, 2)"></el-input>
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
          <el-button name="btnonSearch" type="primary" @click="onSearch"> 搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset"> 重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-10">
      <el-dropdown name="btnDownLoadData" @command="ExportVisible = true">
        <el-button type="primary">
          导出<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item v-if="data.length">导出查询结果</el-dropdown-item> -->
          <el-dropdown-item>导出查询结果</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <div class="p-l-10 p-r-10">
      <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="BarCode" label="条码" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
        <el-table-column prop="StyleCode" label="款号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsTypeName" label="货品类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" sortable="custom" label="入库日期" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.CreateTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="LastRetailTime" sortable="custom" label="最近销售日期" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.LastRetailTime | filterDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="StockAge" label="库龄(天)" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
    </div>
    <base-export-field-setter
      @submit="downLoadData"
      :title="'导出查询结果'"
      :visible.sync="ExportVisible"
      :items="ExportColumns"
      :props="{key: 'FieldEnName', label: 'FieldCnName'}"
    />
  </el-row>
</template>

<script>
import pagination from '@/components/pagination'
import {
  GoodsSaleState,
  GoodsType,
  FinanceType,
  StockCompareType,
  GoodsStockWarehousePositionType
} from '@/enums/stocking'
import {
  CharacterType,
  YNStatus
} from '@/enums/common'
import {
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKAGE,
  STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYSTOCKAGE,
} from '@/apis/stocking'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
export default {
  data() {
    return {
      characterTypes: {
      },
      goodsSaleState: {
      },
      goodsTypes: {
      },
      financeTypes: {
      },
      stockCompareTypes: {
      },
      parameters: {
      },
      characterId: [0],
      queryForm: {
        SellType: '所有状态', //	货品销售状态(枚举)
        BarCode: '', //	门店条码
        StyleCode: '', //	门店款号
        GoodsName: '', //	货品名称
        FinanceType: 0, //	货品类别(枚举)
        GoodsType: 0, //	货品类型(枚举)
        MaterialType: 0, //	材质类型(枚举)
        CategoryType: 0, //	品类(枚举)
        GoldType: 0, //	成色(枚举)
        CreateTime: [],
        LastRetailTime: [],
        CreateTime1: '', //	入库日期(开始)
        CreateTime2: '', //	入库日期(结束)
        LastRetailTime1: '', //	最近零售时间(开始)
        LastRetailTime2: '', //	最近零售时间(结束)
        StockAge1: '', //	库龄(开始)
        StockAge2: '', //	库龄(结束)
        CompchterId: 0, //	商户序号
        StorechterId: 0, //	门店序号
        StockCompareType: 0, //	库存比较类型(枚举)
        FinanceQty1: '', //	账面库存1
        FinanceQty2: '', //	账面库存2
        OrderBy: 0, //	排序字段(0销售日期1入库日期2条码3款号)
        IsAsced: YNStatus.No, //	是否升序(枚举)
        PageIndex: 1, //	当前页码
        PageSize: 20, //	每页?条
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
        ],
        StockAge1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入非负数字'))
              } else if (
                this.queryForm.StockAge2 &&
                parseFloat(value) > parseFloat(this.queryForm.StockAge2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        StockAge2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入非负数字'))
              } else if (
                this.queryForm.StockAge1 &&
                parseFloat(value) < parseFloat(this.queryForm.StockAge1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      total: 0, // 总数
      data: [], // 接收tab的参数
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
          FieldEnName: 'StockAge',
          FieldCnName: '库龄(天)',
        }
      ],
      locationData: []
    }
  },
  methods: {
    getData() {
      let createTime = this.queryForm.CreateTime.length ? this.queryForm.CreateTime : [
        '',
        ''
      ] // 入库的时间
      let LastRetailTime = this.queryForm.LastRetailTime.length ? this.queryForm.LastRetailTime : [
        '',
        ''
      ] // 最后零售的时间
      let parameter = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        LastRetailTime1: LastRetailTime[0],
        LastRetailTime2: LastRetailTime[1],
        PositionType: 0,
        CompchterId: 0,
        StorechterId: 0,
        WarehouseId: 0,
      }
      switch (this.characterId[0]) {
        case 0:
          parameter.PositionType = 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.WarehouseId = 0
          break
        case GoodsStockWarehousePositionType.Warehouse:
          parameter.PositionType = this.characterId[0]
          parameter.WarehouseId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          break
        case GoodsStockWarehousePositionType.Store:
          parameter.PositionType = this.characterId[0]
          parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.WarehouseId = 0
          break
        default:
          parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = this.characterId[0] ? this.characterId[0] : 0
          parameter.PositionType = parameter.StorechterId === 0 ? GoodsStockWarehousePositionType.Warehouse : GoodsStockWarehousePositionType.Store
          parameter.WarehouseId = 0
          break
      }
      this.$store.commit('SET_TB_LOADING', true)
      this.queryForm = Object.assign(this.queryForm, this.parameters,  parameter)
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKAGE(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
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
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    pageChange(val) {
      this.parameters.PageIndex = val
      Object.assign(this.queryForm, this.parameters)
      this.getData()
    },
    pageSizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      Object.assign(this.queryForm, this.parameters)
      this.getData()
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
      this.characterId = [0]
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    downLoadData(fields) {
      let createTime = this.queryForm.CreateTime || ['1900-01-01', '1900-01-01'] // 入库的时间
      let LastRetailTime = this.queryForm.LastRetailTime || [
        '1900-01-01',
        '1900-01-01'
      ] // 最后零售的时间
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYSTOCKAGE(
        { ...this.queryForm, 
          PageIndex: 1,
          PageSize: 0,
          CreateTime1: createTime[0],
          CreateTime2: createTime[1],
          LastRetailTime1: LastRetailTime[0],
          LastRetailTime2: LastRetailTime[1],
          StockAge1: this.queryForm.StockAge1 ? this.queryForm.StockAge1 : 0,
          StockAge2: this.queryForm.StockAge2 ? this.queryForm.StockAge2 : 0,
          FinanceQty1: this.queryForm.FinanceQty1 ? this.queryForm.FinanceQty1 : 0,
          FinanceQty2: this.queryForm.FinanceQty2 ? this.queryForm.FinanceQty2 : 0,
          ExportUserId: this.$store.getters.user_session.UserId,
          ExportUser: this.$store.getters.user_session.TrueName,
          ExportCharacterId: this.$store.getters.user_session.CharacterId,
          ExportColumns	: fields,
        }
      ).then(res => {
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
    },
    getLocation() {
      this.locationData = [{'KeyId': 0, 'Value': '所有位置'}].concat(GoodsStockWarehousePositionType.TypeArray)
      this.locationData.map(item => {
        item['Id'] = item['KeyId']
        return item
      })
      if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
        this.$store.dispatch('GET_WAREHOUSES_DROPLIST').then(res => {
          this.locationData.forEach(item => {
            if (item.Id === GoodsStockWarehousePositionType.Warehouse) {
              item.Value = '所有总部仓库'
              item.Childrens = res
            }
          })
        })
        this.$store.dispatch('GET_STORES_DROPLIST').then(res => {
          let store = res, tmp
          store.map(item => {
            tmp = item['CharacterId']
            item['CharacterId'] = item['Id']
            item['Id'] = tmp
            return item
          })
          this.locationData.forEach(item => {
            if (item.Id === GoodsStockWarehousePositionType.Store) {
              item.Value = '所有门店'
              item.Childrens = store
            }
          })
        })
      }
      if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
        this.locationData = this.locationData.filter(item => {
          return item.Id === 0
        })
        this.$store.dispatch('GET_COMPANYS_DROPLIST', {HasStore: YNStatus.Yes, State: 0}).then(res => {
          let company = res, tmp, childTmp
          company.map(val => {
            tmp = val['CharacterId']
            val['CharacterId'] = val['Id']
            val['Id'] = tmp
            if (val.Childrens) {
              val.Childrens.map(item => {
                childTmp = item['CharacterId']
                item['CharacterId'] = item['Id']
                item['Id'] = childTmp
              })
            }
          })
          this.locationData = this.locationData.concat(company)
        })
      }
    }
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.goodsSaleState = GoodsSaleState
    this.goodsTypes = GoodsType
    this.financeTypes = FinanceType
    this.stockCompareTypes = StockCompareType
    this.getLocation()
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

