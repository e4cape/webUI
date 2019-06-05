<template>
  <el-row>
    <el-form :model="queryForm" :rules="queryRules" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="门店：" prop="StoreCharacterId">
            <el-select name="StoreCharacterId" v-model="queryForm.StoreCharacterId" placeholder="所有门店">
              <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :label="item.Value" :value="parseInt(item.CharacterId)"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别：" prop="FinanceType">
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" value="0"></el-option>
              <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材质：" prop="MaterialType">
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质">
              <el-option label="所有材质" value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类">
              <el-option label="所有品类" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色">
              <el-option label="所有成色" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：" prop="GoodsType">
            <el-select name="GoodsType" v-model="queryForm.GoodsType" placeholder="所有类型">
              <el-option label="所有类型" value="0"> </el-option>
              <el-option v-for="(item, index) in goodsTypes.Types" :key="index" :label="item" :value="index"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存：" prop="StockCompareType">
            <el-select name="StockCompareType" v-model="queryForm.StockCompareType" placeholder="所有库存">
              <el-option label="所有库存" value="0"> </el-option>
              <el-option v-for="(item, index) in stockCompareTypes.Types" :key="index" :label="item" :value="index"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条码：" prop="StoreBarCode">
            <el-input name="StoreBarCode" v-model="queryForm.StoreBarCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="款号：" prop="StoreStyleNumber">
            <el-input name="StoreStyleNumber" v-model="queryForm.StoreStyleNumber" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="货品名称：" prop="GoodsName">
            <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="可用库存：" prop="AvailableQty1">
            <el-col :span="11">
              <el-form-item prop="AvailableQty1" class="inline no-margin">
                <el-input name="AvailableQty1" v-model="queryForm.AvailableQty1" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="AvailableQty2" class="inline no-margin">
                <el-input name="AvailableQty2" v-model="queryForm.AvailableQty2" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
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
          <el-form-item label="待出库存：">
            <el-col :span="11">
              <el-form-item prop="OutakeQty1" class="inline no-margin">
                <el-input name="OutakeQty1" v-model="queryForm.OutakeQty1" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="OutakeQty2" class="inline no-margin">
                <el-input name="OutakeQty2" v-model="queryForm.OutakeQty2" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="是否旧货：" prop="IsJunk">
            <el-select name="IsJunk" v-model="queryForm.IsJunk" placeholder="是否旧货">
              <el-option label="全部" value="0"> </el-option>
              <el-option v-for="(item, index) in ynStatus.Types" :key="index" :label="item" :value="index"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch"> 搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset"> 重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-10">
      <el-col :span="10">
        <el-dropdown @command="handleCommand">
          <el-button name="btnhandleCommand" type="primary">
            导出<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item name="a" command="a">导出查询结果</el-dropdown-item>
            <el-dropdown-item name="b" command="b">导出货品信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col class="tb-top-total" :span="14">
        <span class="detail-info-num-item">
          待出库存:<b class="num">{{totalCount.TotalOutakeQty}}</b>
        </span>
        <span class="detail-info-num-item">
          账面库存:<b class="num">{{totalCount.TotalFinanceQty}}</b>
        </span>
        <span class="detail-info-num-item">
          可用库存：<b class="num">{{totalCount.TotalAvailableQty}}</b>
        </span>
      </el-col>
    </el-row>
    <el-table :data="data" @sort-change="sortChange" row-key="index" :expand-row-keys="expandRows" style="width: 100%" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @expand-change="expand">
      <el-table-column show-overflow-tooltip type="expand" fixed>
        <template slot-scope="props" name="other">
          <el-row style="width:421px;">
            <el-col :offset="24">
              <el-table :data="props.row.children" v-loading="props.row.childLoading">
                <el-table-column show-overflow-tooltip prop="DeskName" width="120" label="位置">
                  <template slot-scope="props">
                    <span>{{props.row.DeskName?props.row.DeskName:'仓库位置'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="AvailableQty" width="100" label="可用库存"></el-table-column>
                <el-table-column show-overflow-tooltip prop="FinanceQty" width="100" label="账面库存"></el-table-column>
                <el-table-column show-overflow-tooltip prop="OutakeQty" width="100" label="待出库存"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreBarCode" label="条码" sortable="custom" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreStyleNumber" label="款号" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip prop="GoodsName" label="货品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.IsJunk == ynStatus.Yes" class="junk-icon"></span>
          {{scope.row.GoodsName}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="AvailableQty" label="可用库存"></el-table-column>
      <el-table-column show-overflow-tooltip prop="FinanceQty" label="账面库存"></el-table-column>
      <el-table-column show-overflow-tooltip prop="OutakeQty" label="待出库存"></el-table-column>
      <el-table-column show-overflow-tooltip prop="GoodsTypeName" label="货品类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="GoodsTypeName" label="入库类型">
        <template slot-scope="scope">
          <span>{{ financeTypes.Types[scope.row.FinanceType] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreName" label="位置"></el-table-column>
      <el-table-column show-overflow-tooltip prop="LastTime" label="最后操作时间" sortable="custom" width="145">
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.LastTime | filterDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="140" fixed="right">
        <template slot-scope="scope" name="action">
          <el-button name="btnshowDetailDialog" type="text" class="btn-link" @click="showDetailDialog(scope.row.GoodsId)">查看</el-button>
          <el-button name="btnshowGoodsLog" type="text" class="btn-link" @click="showGoodsLog(scope.row.GoodsId, scope.row.CharacterId)">出入库记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>

    <!-- 查看货品详情 -->
    <good-detail v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-detail>
    <!-- end 查看货品详情-->

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" @close="goodsLog.size = 10" width="1000px">
      <el-table :data="goodsLog.data">
        <el-table-column prop="CreateTime" label="操作时间" min-width="180">
          <template slot-scope="scope">
            {{scope.row.CreateTime.substr(0, 19).replace('T', ' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="OperationType" label="操作类型" min-width="100">
          <template slot-scope="scope">
            {{operationType.Types[scope.row.OperationType]}}
          </template>
        </el-table-column>
        <el-table-column prop="SourceCode" label="来源单号" min-width="140"></el-table-column>
        <el-table-column prop="CreateUser" label="操作人" min-width="110"></el-table-column>
        <el-table-column prop="Quantity" label="库存变化" min-width="100">
          <template slot-scope="scope">
            {{ (scope.row.Quantity > 0 ? '+' : '') + scope.row.Quantity}}
          </template>
        </el-table-column>
        <el-table-column prop="FinanceQty" label="库存结存" min-width="100"></el-table-column>
        <el-table-column prop="Note" label="备注" min-width="100"></el-table-column>
      </el-table>
      <pagination :pg="goodsLog.pg" :size="goodsLog.size" :total="goodsLog.total" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
    </el-dialog>
  </el-row>
</template>
<script>
import pagination from '@/components/pagination'
import goodDetail from './goodDetail'
import {
  GoodsType,
  FinanceType,
  StockCompareType,
} from '@/enums/stocking'
import {
  YNStatus, OperationType
} from '@/enums/common'
import {
  STOCKING_API_REPORT_STOCKSLIST,
  STOCKING_API_REPORT_EXPORTSTOCKITEM,
  STOCKING_API_REPORT_EXPORTSTOCKQUEUE,
  STOCKING_API_REPORT_EXPORTGOODS,
  STOCKING_API_REPORT_QUEUEGOODS,
  STOCKING_API_STOCK_LOGLIST,
  STOCKING_API_STOCK_DETAILBYGOODS
} from '@/apis/stocking'
export default {
  data() {
    return {
      ynStatus: {
      },
      goodsTypes: {
      },
      financeTypes: {
      },
      stockCompareTypes: {
      },
      operationType: OperationType,
      queryRules: {
        AvailableQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.AvailableQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.AvailableQty2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        AvailableQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.AvailableQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.AvailableQty1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
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
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
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
        OutakeQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.OutakeQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.OutakeQty2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        OutakeQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.OutakeQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.OutakeQty1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      queryForm: {
        StoreBarCode: '', // 门店条码
        StoreStyleNumber: '', // 门店款号
        GoodsName: '', // 货品名称
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        FinanceType: '0', // 货品类型(枚举)
        GoodsType: '0', // 货品类型(枚举)
        GoldType: '0', // 成色(枚举)
        GoldWeight1: '', // 净金重(g)
        GoldWeight2: '', // 净金重(g)
        Weight1: '', // 货重(g)
        Weight2: '', // 货重(g)
        IsJunk: '', // 是否旧货(枚举)
        StoneWeight1: '', // 主石重
        StoneWeight2: '', // 主石重
        CompanyCharacterId: 0, // 商户序号
        StoreCharacterId: 0, // 门店序号
        DeskId: -1, // 柜台序号
        StockCompareType: '0', // 库存比较类型(枚举)
        FinanceQty1: '', // 账面库存1
        FinanceQty2: '', // 账面库存2
        AvailableQty1: '', // 可用库存1
        AvailableQty2: '', // 可用库存2
        OutakeQty1: '', // 待出库存1
        OutakeQty2: '', // 待出库存2
        OrderBy: 0, // 排序字段(0=最后操作时间 1==条码 2==款号)
        IsAsc: YNStatus.No, // 是否升序(枚举)
        PageIndex: '1', // 当前页码
        PageSize: '20', // 每页?条
      },
      parameters: {
      },
      totalCount: {
        totalOutakeQty: 0,
        totalFinanceQty: 0,
        totalAvailableQty: 0
      },
      total: 0,
      data: [],
      expandRows: [],
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      goodsLogDialog: false, // 出入库记录对话框
      goodsLog: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
        totalData: []
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_STOCKSLIST(
        Object.assign(this.queryForm, this.parameters)
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.data.map((item, index) => {
            item.index = index
            item.childLoading = false
            item.children = []
            return item
          })
          this.total = res.data.Data.records
          this.totalCount = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'LastTime':
          this.queryForm.OrderBy = 0
          break
        case 'StoreBarCode':
          this.queryForm.OrderBy = 1
          break
        case 'StoreStyleNumber':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
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
          this.parameters = Object.assign({
          }, this.queryForm)
          this.getData()
        }
      })
    },
    onReset() {
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    // 导出操作
    handleCommand(command) {
      if (command === 'a') {
        this.commandA()
      } else {
        this.commandB()
      }
    },
    // 导出查询结果
    commandA() {
      this.commandLoading = true
      if (this.total <= 10000) {
        // 小于等于10000条
        STOCKING_API_REPORT_EXPORTSTOCKITEM(
          Object.assign(this.queryForm, this.parameters)
        )
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + res.data.Data.FilePath
              )
            } else {
              this.$message.error(res.data.Message)
            }
            this.commandLoading = false
          })
          .catch(() => {
            this.$message.error('网络错误')
            this.commandLoading = false
          })
      } else {
        // 大于10000条
        STOCKING_API_REPORT_EXPORTSTOCKQUEUE(
          Object.assign(this.queryForm, this.parameters)
        )
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('导出成功，请稍后到“我的下载”中下载')
            } else {
              this.$message.error('导出失败')
            }
            this.commandLoading = false
          })
          .catch(() => {
            this.$message.error('网络错误')
            this.commandLoading = false
          })
      }
    },
    // 导出货品信息
    commandB() {
      this.commandLoading = true
      if (this.total <= 10000) {
        STOCKING_API_REPORT_EXPORTGOODS(
          Object.assign(this.queryForm, this.parameters)
        )
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + res.data.Data.FilePath
              )
            } else {
              this.$message.error(res.data.Message)
            }
            this.commandLoading = false
          })
          .catch(() => {
            this.$message.error('网络错误')
            this.commandLoading = false
          })
      } else {
        // 大于10000条
        STOCKING_API_REPORT_QUEUEGOODS(
          Object.assign(this.queryForm, this.parameters)
        )
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('导出成功，请稍后到“我的下载”中下载')
            } else {
              this.$message.error('导出失败')
            }
            this.commandLoading = false
          })
          .catch(() => {
            this.$message.error('网络错误')
            this.commandLoading = false
          })
      }
    },
    expand(row) {
      if (this.expandRows.indexOf(row.index) === -1) {
        row.childLoading = true
        this.expandRows = [row.index]
        STOCKING_API_STOCK_DETAILBYGOODS({
          CharacterId: row.CharacterId,
          GoodsId: row.GoodsId
        }).then(res => {
          row.childLoading = false
          if (res.data.Code === 'CORRECT') {
            row.children = res.data.Data
            this.$set(this.data, row.index, row)
          }
        })
      } else {
        this.expandRows = []
      }
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    showGoodsLog(goodsId, CharacterId) {
      STOCKING_API_STOCK_LOGLIST({
        GoodsId: goodsId,
        CharacterId: CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsLog.pg = 1
          this.goodsLog.totalData = res.data.Data
          this.goodsLog.total = this.goodsLog.totalData.length
          this.goodsLog.data = this.getLogPageData()
          this.goodsLogDialog = true
        }
      })
    },
    getLogPageData() {
      let offset = (this.goodsLog.pg - 1) * this.goodsLog.size
      return offset + this.goodsLog.size >= this.goodsLog.total
        ? this.goodsLog.totalData.slice(offset, this.goodsLog.total)
        : this.goodsLog.totalData.slice(offset, offset + this.goodsLog.size)
    },
    goodsLogPageChange(val) {
      this.goodsLog.pg = val
      this.goodsLog.data = this.getLogPageData()
    },
    goodsLogPageSizeChange(val) {
      if (this.goodsLog.size !== val) {
        this.goodsLog.size = val
        this.goodsLog.pg = 1
        this.goodsLog.data = this.getLogPageData()
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_SERIES_TYPE')
    },
  },
  created () {
    this.getStoreAllType()
  },
  beforeMount() {
    this.ynStatus = YNStatus
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
    goodDetail
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
