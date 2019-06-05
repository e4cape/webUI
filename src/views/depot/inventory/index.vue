<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :rules="queryRules" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-checkbox-group v-model="showTypes" class="el-radio-group">
            <el-checkbox-button label="1">查看件数</el-checkbox-button>
            <el-checkbox-button label="2">查看金重</el-checkbox-button>
            <el-checkbox-button label="3">查看标签金额</el-checkbox-button>
            <el-checkbox-button label="4">查看成本金额</el-checkbox-button>
          </el-checkbox-group>
          <el-dropdown @command="downLoad" v-if="data.length" name="download">
            <el-button>
              导出<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loadData">导出查询结果</el-dropdown-item>
              <el-dropdown-item command="loadGood">导出货品信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="selectDeskId" v-if="characterType === CharacterType.Company">
            <el-select v-model="queryForm.selectDeskId" placeholder="所有位置" :filterable="true" name="selectDeskId">
              <el-option label="总库存" :value="-1"></el-option>
              <el-option label="仓库" :value="0"></el-option>
              <el-option v-for="item in desks" :key="item.value" :label="item.DeskName" :value="item.DeskId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StoreBarCode">
            <el-input v-model="queryForm.StoreBarCode" placeholder="条码" @keyup.enter.native="onSearch" name="storeBarCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有类别：" prop="FinanceType">
            <el-select v-model="queryForm.FinanceType" placeholder="所有类别" :filterable="true" name="financeType">
              <el-option label="所有类别" value="0"></el-option>
              <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有材质：" prop="MaterialType">
            <el-select v-model="queryForm.MaterialType" placeholder="所有材质" :filterable="true" name="materialType">
              <el-option label="所有材质" value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有品类：" prop="CategoryType">
            <el-select v-model="queryForm.CategoryType" placeholder="所有品类" :filterable="true" name="categoryType">
              <el-option label="所有品类" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有成色：" prop="GoldType">
            <el-select v-model="queryForm.GoldType" placeholder="所有成色" :filterable="true" name="goldType">
              <el-option label="所有成色" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有库存：" prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" placeholder="所有库存" :filterable="true" name="stockCompareType">
              <el-option label="所有库存" value="0"> </el-option>
              <el-option v-for="(item, index) in stockCompareTypes.Types" :key="index" :label="item" :value="String(index)"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类型：" prop="GoodsType">
            <el-select v-model="queryForm.GoodsType" placeholder="所有类型" :filterable="true" name="goodsType">
              <el-option label="所有类型" value="0"> </el-option>
              <el-option v-for="(item, index) in goodsTypes.Types" :key="index" :label="item" :value="String(index)"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StoreBarCode" label="条码：">
            <el-input v-model="queryForm.StoreBarCode" :maxlength="50" @keyup.enter.native="onSearch" name="storeBarCode"></el-input>
          </el-form-item>
          <el-form-item prop="StoreStyleNumber" label="款号：">
            <el-input v-model="queryForm.StoreStyleNumber" :maxlength="50" @keyup.enter.native="onSearch" name="storeStyleNumber"></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch" name="goodsName"></el-input>
          </el-form-item>
          <el-form-item prop="IsJunk" label="是否旧货：">
            <el-select v-model="queryForm.IsJunk" placeholder="是否旧货" name="IsJunk">
              <el-option label="全部" value="0"> </el-option>
              <el-option v-for="(item, index) in YNStatus.Types" :key="index" :label="item" :value="String(index)"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可用库存：">
            <el-col :span="11">
              <el-form-item prop="AvailableQty1" class="inline no-margin">
                <el-input v-model="queryForm.AvailableQty1" :maxlength="9" @keyup.enter.native="onSearch" name="availableQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="AvailableQty2" class="inline no-margin">
                <el-input v-model="queryForm.AvailableQty2" :maxlength="9" @keyup.enter.native="onSearch" name="availableQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="账面库存：">
            <el-col :span="11">
              <el-form-item prop="FinanceQty1" class="inline no-margin">
                <el-input v-model="queryForm.FinanceQty1" :maxlength="9" @keyup.enter.native="onSearch" name="financeQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="FinanceQty2" class="inline no-margin">
                <el-input v-model="queryForm.FinanceQty2" :maxlength="9" @keyup.enter.native="onSearch" name="financeQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="待出库存：">
            <el-col :span="11">
              <el-form-item prop="OutakeQty1" class="inline no-margin">
                <el-input v-model="queryForm.OutakeQty1" :maxlength="9" @keyup.enter.native="onSearch" name="outakeQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="OutakeQty2" class="inline no-margin">
                <el-input v-model="queryForm.OutakeQty2" :maxlength="9" @keyup.enter.native="onSearch" name="outakeQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="主石重（ct）：">
            <el-col :span="11">
              <el-form-item prop="StoneWeight1" class="inline no-margin">
                <el-input v-model="queryForm.StoneWeight1" :maxlength="9" @keyup.enter.native="onSearch" name="stoneWeight1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="StoneWeight2" class="inline no-margin">
                <el-input v-model="queryForm.StoneWeight2" :maxlength="9" @keyup.enter.native="onSearch" name="stoneWeight2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- <div class="checkPage-hd">
      <el-row>
        <el-col :span="24" class="tr">
          <span class="detail-info-num-item">
            可用库存：<b class="num">{{showType === 'stock' ? totalQty.TotalAvailableQty : showType === 'gold' ? totalQty.TotalAvailableWgt + 'g' : '￥' + totalQty.TotalAvailableStuff}}</b>
          </span>
          <span class="detail-info-num-item">
            账面库存：<b class="num">{{showType === 'stock' ? totalQty.TotalFinanceQty : showType === 'gold' ? totalQty.TotalFinanceWgt + 'g' : '￥' + totalQty.TotalFinanceStuff}}</b>
          </span>
          <span class="detail-info-num-item">
            待出库存：<b class="num">{{showType === 'stock' ? totalQty.TotalOutakeQty : showType === 'gold' ? totalQty.TotalOutakeWgt + 'g' : '￥' + totalQty.TotalOutakeStuff}}</b>
          </span>
        </el-col>
      </el-row>
    </div> -->
    <!-- Data Table -->
    <el-table :data="data" @sort-change="sortChange" row-key="RowIndex" :expand-row-keys="expandRows" @expand-change="expandRow" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" show-summary  :summary-method="getSummaries">
      <el-table-column type="expand" fixed>
        <template slot-scope="scope">
          <!-- <table class="expand-talble" v-if="scope.row.children">
            <thead>
              <tr>
                <th>位置</th>
                <th>可用库存</th>
                <th>账面库存</th>
                <th>待出库存</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(child,index) in scope.row.children" :key="index">
                <td>{{child.DeskName || '仓库'}}</td>
                <td>{{showType === 'stock' ? child.AvailableQty : showType === 'gold' ? child.AvailableQty * scope.row.GoldWeight + 'g' : '￥' + child.AvailableQty * scope.row.StuffPrice}}</td>
                <td>{{showType === 'stock' ? child.FinanceQty : showType === 'gold' ? child.FinanceQty * scope.row.GoldWeight + 'g' : '￥' + child.FinanceQty * scope.row.StuffPrice}}</td>
                <td>{{showType === 'stock' ? child.OutakeQty : showType === 'gold' ? child.OutakeQty * scope.row.GoldWeight + 'g' : '￥' + child.OutakeQty * scope.row.StuffPrice}}</td>
              </tr>
            </tbody>
          </table> -->
          <div class="expand-talble">
            <el-table :data="scope.row.children">
              <el-table-column prop="DeskName" label="位置"></el-table-column>
              <el-table-column label="可用库存">
                <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
                <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
              </el-table-column>
              <el-table-column label="账面库存">
                <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
                <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
              </el-table-column>
              <el-table-column label="待出库存">
                <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
                <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="StoreBarCode" label="条码" min-width="140" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="StoreStyleNumber" label="款号" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.IsJunk == YNStatus.Yes" class="junk-icon"></span>
          {{scope.row.GoodsName}}
        </template>
      </el-table-column>
      <el-table-column label="可用库存">
        <!-- <template slot-scope="scope">
          {{showType === 'stock' ? scope.row.AvailableQty : showType === 'gold' ? (scope.row.AvailableQty * scope.row.GoldWeight).toFixed(3) + 'g' : '￥' + (scope.row.AvailableQty * scope.row.StuffPrice).toFixed(2)}}
        </template> -->
        <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
        <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
        <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
        <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
      </el-table-column>
      <el-table-column label="账面库存">
        <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
        <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
        <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
        <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
        <!-- <template slot-scope="scope">
          {{showType === 'stock' ? scope.row.FinanceQty : showType === 'gold' ? (scope.row.FinanceQty * scope.row.GoldWeight).toFixed(3) + 'g' : '￥' + (scope.row.FinanceQty * scope.row.StuffPrice).toFixed(2)}}
        </template> -->
      </el-table-column>
      <el-table-column label="待出库存">
        <el-table-column label="件数" v-if="showTypes.indexOf('1')>-1"></el-table-column>
        <el-table-column label="金重" v-if="showTypes.indexOf('2')>-1"></el-table-column>
        <el-table-column label="标签金额" v-if="showTypes.indexOf('3')>-1"></el-table-column>
        <el-table-column label="成本金额" v-if="showTypes.indexOf('4')>-1"></el-table-column>
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.OutakeQty <= 0">
            {{showType === 'stock' ? scope.row.OutakeQty : showType === 'gold' ? (scope.row.OutakeQty * scope.row.GoldWeight).toFixed(3) + 'g' : '￥' + (scope.row.OutakeQty * scope.row.StuffPrice).toFixed(2)}}
          </span>
          <span v-else class="init-button-text btn-span" @click="toShowInventory(scope.row)">
            {{showType === 'stock' ? scope.row.OutakeQty : showType === 'gold' ? (scope.row.OutakeQty * scope.row.GoldWeight).toFixed(3) + 'g' : '￥' + (scope.row.OutakeQty * scope.row.StuffPrice).toFixed(2)}}
          </span>
        </template> -->
      </el-table-column>
      <el-table-column prop="GoodsType" label="货品类型" min-width="80">
        <template slot-scope="scope">
          {{goodsTypes.Types[scope.row.GoodsType]}}
        </template>
      </el-table-column>
      <el-table-column prop="FinanceType" label="入库类别" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{financeTypes.Types[scope.row.FinanceType]}}
        </template>
      </el-table-column>
      <el-table-column prop="DeskName" label="位置" min-width="80" show-overflow-tooltip v-if="characterType === CharacterType.Company">
        <template slot-scope="scope">
          {{queryForm.DeskId === -1 ? '总库存' : queryForm.DeskId === 0 ? '仓库' : scope.row.DeskName}}
        </template>
      </el-table-column>
      <el-table-column prop="LastTime" label="最后操作时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.LastTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailDialog(scope.row.GoodsId)" name="btnShowDetail">查看</el-button>
          <el-button type="text" @click="showGoodsLog(scope.row.GoodsId)" name="btnShowGoodsLog">出入库记录</el-button>
          <!-- <el-button type="text" @click="showPrint(scope.row.GoodsId)" name="btnShowPrint">打印</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- dialog 货品详情 -->
    <good-detail v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" class="log-dialog" @close="goodsLog.size = 10">
      <div class="panel">
        <div class="panel-bd">
          <el-table :data="goodsLog.data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="CreateTime" label="操作时间" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime | filterDateMinutes}}
              </template>
            </el-table-column>
            <el-table-column prop="OperationType" label="操作类型" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                {{stockLogOperationTypes.Types[scope.row.OperationType]}}
              </template>
            </el-table-column>
            <el-table-column prop="SourceCode" label="来源单号" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CreateUser" label="操作人" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="库存变化" min-width="100">
              <template slot-scope="scope">
                {{ (scope.row.Quantity > 0 ? '+' : '') + scope.row.Quantity}}
              </template>
            </el-table-column>
            <el-table-column prop="FinanceQty" label="库存结存" min-width="100"></el-table-column>
            <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="goodsLog.pg" :size="goodsLog.size" :total="goodsLog.total" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
        </div>
      </div>
    </el-dialog>
    <!-- end 出入库记录 -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog"  :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({GoodsId: goodsId}))" :printingType="storeSettingPrintingTypes.StockingCloudGoodsLabel" @listenPrintDialog="printDialog = false"></print-order>
    <!-- End Dialog·打印 -->

    <!-- dialog 待出库存 -->
    <el-dialog title="待出库存" :visible.sync="showInventoryDialog" class="log-dialog" @close="closeShowInventor">
      <div class="panel">
        <div class="panel-bd">
          <el-table :data="showInventoryData" :default-sort="{prop: 'CreateTime', order: 'descending'}" v-loading="showInventoryDataLoading" element-loading-text="拼命加载中">
            <el-table-column prop="SystemOrderType" label="单据类型" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                {{systemOrderTypes.Types[scope.row.SystemOrderType]}}
              </template>
            </el-table-column>
            <el-table-column prop="OrderCode" label="相关单号" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{ path: scope.row.SystemOrderType == systemOrderTypes.StockingCloudReturnOrder 
                ? '/stock/return/returnCheck' : 
                scope.row.SystemOrderType == systemOrderTypes.StockingCloudTakingReport1 
                ? '/stock/stockloss/stocklossCheck' : 
                scope.row.SystemOrderType == systemOrderTypes.StockingCloudAppropOrder 
                ? '/stock/appropOut/appropOutCheck' 
                : scope.row.SystemOrderType == systemOrderTypes.StockingCloudSaleOrder 
                ? '/order/retail/retailBigCheck?code='+ scope.row.OrderCode 
                : '/stock/inventory/index' , query: {id: scope.row.OrderId} }" name="btnLink">{{scope.row.OrderCode}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" sortable min-width="180" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="dialogPg" :size="dialogSize" :total="dialogTotal" @currentChange="currentChange2" @sizeChange="sizeChange2"></pagination>
          <!-- Pagination end -->
        </div>
      </div>
    </el-dialog>
    <!-- end 待出库存 -->

  </el-row>
</template>

<script>
import {
  StockType,
  FinanceType,
  StockCompareType,
  GoodsType,
  SystemOrderType,
  StockLogOperationType,
  StoreSettingPrintingType
} from '@/enums/merchant.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  STOCKING_API_DESK_DESKDROPDOWNLIST,
  STOCKING_API_STOCK_LIST,
  STOCKING_API_STOCK_DETAILBYGOODS,
  STOCKING_API_STOCK_LOG,
  STOCKING_API_STOCK_EXPORT,
  STOCKING_API_STOCK_QUEUE,
  STOCKING_API_STOCK_WAITOUTLIST,
  STOCKING_API_STOCK_EXPORTRESULT,
  STOCKING_API_STOCK_QUEUERESULT
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goodDetail from '@/components/erp/goodDetail'
import printOrder from '@/components/erp/printOrder'
export default {
  data() {
    return {
      CharacterType,
      YNStatus,
      financeTypes: FinanceType,
      stockCompareTypes: StockCompareType,
      stockTypes: StockType,
      goodsTypes: GoodsType,
      systemOrderTypes: SystemOrderType,
      stockLogOperationTypes: StockLogOperationType,
      storeSettingPrintingTypes: StoreSettingPrintingType,
      showType: 'stock', // 件数和金重
      showTypes: ['1'],
      desks: [], // 所有来源
      queryForm: {
        // 查询表单数据
        IsJunk: '',
        StoreBarCode: '',
        StoreStyleNumber: '',
        GoodsName: '',
        AvailableQty1: '',
        AvailableQty2: '',
        FinanceQty1: '',
        FinanceQty2: '',
        OutakeQty1: '',
        OutakeQty2: '',
        StoneWeight1: '',
        StoneWeight2: '',
        DeskId: -1,
        selectDeskId: -1,
        FinanceType: '',
        StockCompareType: StockCompareType.FinanceQtyThanZero + '',
        StockType: StockType.StockOfSummary,
        GoodsType: '',
        MaterialType: '',
        CategoryType: '',
        GoldType: '',
        OrderBy: 0, // 排序字段(0=最后操作时间,1=条码, 2=款号)
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
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
        ],
        StoneWeight1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
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
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.StoneWeight1 &&
                parseFloat(value) < parseFloat(this.queryForm.StoneWeight1)
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
      goodsLogDialog: false, // 出入库记录对话框
      goodsLog: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
        totalData: []
      },
      totalQty: {
        TotalFinanceQty: 0, // 总账面库存
        TotalAvailableQty: 0, // 总可用库存
        TotalOutakeQty: 0 // 总待出库存
      },
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      allInventoryData: [], // 所有待出库存弹窗数据list
      showInventoryDialog: false, // 待出库存弹窗
      showInventoryDataLoading: false, // 待出库存弹窗loading
      showInventoryData: [], // 待出库存弹窗数据list
      dialogSize: 10, // 待出库存弹窗数据Size
      dialogPg: 1, // 待出库存弹窗数据pg
      dialogTotal: 0, // total
      expandRows: [],
      parameters: {
      },
      printDialog: false,
      goodsId: ''
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    getSummaries(param) { // 自定义合计列
      console.log(param)
      const {
        columns 
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {return sums[0] = '合计'}
        if(column.property&&column.property === '') {
          sums[index] = 0
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            IsJunk: '',
            StoreBarCode: '',
            StoreStyleNumber: '',
            GoodsName: '',
            AvailableQty1: '',
            AvailableQty2: '',
            FinanceQty1: '',
            FinanceQty2: '',
            OutakeQty1: '',
            OutakeQty2: '',
            StoneWeight1: '',
            StoneWeight2: '',
            DeskId: -1,
            selectDeskId: -1,
            FinanceType: '',
            StockCompareType: this.stockCompareTypes.FinanceQtyThanZero + '',
            StockType: StockType.StockOfSummary,
            GoodsType: '',
            MaterialType: '',
            CategoryType: '',
            GoldType: '',
            OrderBy: 0, // 排序字段(0=最后操作时间,1=条码, 2=款号)
            IsAsc: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({
      }, query)
      let DeskId =
        Number(query.selectDeskId) == 0
          ? 0
          : Number(query.selectDeskId) == -1
            ? -1
            : Number(query.selectDeskId)
      this.parameters.selectDeskId = DeskId
      this.parameters.DeskId = DeskId
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_STOCK_LIST(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.data.map((item, i) => {
            item.RowIndex = i
          })
          this.totalQty = Object.assign(this.totalQty, res.data.Data.total)
          let first = this.data && this.data.length && this.data[0]
          this.total = first.TOTALCOUNT || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
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
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    getDesks() {
      STOCKING_API_DESK_DESKDROPDOWNLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.desks = res.data.Data
        }
      })
    },
    showGoodsLog(goodsId) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_STOCK_LOG({
        goodsId: goodsId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.goodsLog.pg = 1
          let data = res.data.Data
          data.sort((a, b) => {
            return (
              new Date(b.CreateTime.replace('-', '/')) -
              new Date(a.CreateTime.replace('-', '/'))
            )
          })
          this.goodsLog.totalData = data
          this.goodsLog.total = this.goodsLog.totalData.length
          this.goodsLog.data = this.pagination()
          this.goodsLogDialog = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    pagination() {
      let offset = (this.goodsLog.pg - 1) * this.goodsLog.size
      return offset + this.goodsLog.size >= this.goodsLog.total
        ? this.goodsLog.totalData.slice(offset, this.goodsLog.total)
        : this.goodsLog.totalData.slice(offset, offset + this.goodsLog.size)
    },
    goodsLogPageChange(val) {
      this.goodsLog.pg = val
      this.goodsLog.data = this.pagination()
    },
    goodsLogPageSizeChange(val) {
      if (this.goodsLog.size !== val) {
        this.goodsLog.size = val
        this.goodsLog.pg = 1
        this.goodsLog.data = this.pagination()
      }
    },
    downLoad(command) {
      this.$store.commit('SET_FULL_LOADING', true)
      if (command === 'loadData') {
        this.downLoadData()
      } else if (command === 'loadGood') {
        this.downLoadGoods()
      }
    },
    downLoadData() {
      let apiName = STOCKING_API_STOCK_EXPORTRESULT
      if (this.total > 10000) {
        apiName = STOCKING_API_STOCK_QUEUERESULT
      }
      apiName(this.queryForm).then(res => {
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
            window.open(
              this.$root.settings.DOMAIN_TEMP + res.data.Data.FilePath
            )
          }, 1000)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    downLoadGoods() {
      let apiName = STOCKING_API_STOCK_EXPORT
      if (this.total > 10000) {
        apiName = STOCKING_API_STOCK_QUEUE
      }
      apiName(this.queryForm).then(res => {
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
            window.open(
              this.$root.settings.DOMAIN_TEMP + res.data.Data.FilePath
            )
          }, 1000)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    expandRow(row) {
      if (this.expandRows.indexOf(row.RowIndex) === -1) {
        this.expandRows = [row.RowIndex]
        if (!row.children) {
          STOCKING_API_STOCK_DETAILBYGOODS({
            GoodsId: row.GoodsId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              row.children = res.data.Data
              this.$set(this.data, row.RowIndex, row)
            }
          })
        }
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
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters 
      })
    },
    // showTypeChange(type) {
    //   this.showType = type
    // },
    // showPrint(id) {
    //   this.goodsId = id
    //   this.printDialog = true
    // },
    toShowInventory(row) {
      // 待出库存
      this.showInventoryDialog = true
      this.showInventoryDataLoading = true // 待出库存弹窗loading
      STOCKING_API_STOCK_WAITOUTLIST({
        GoodsId: row.GoodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allInventoryData = res.data.Data.reverse()
          this.showInventoryData = this.allInventoryData.slice(
            (this.dialogPg - 1) * this.dialogSize,
            this.dialogPg * this.dialogSize
          )
          this.dialogTotal = this.allInventoryData.length
        }
        this.showInventoryDataLoading = false // 待出库存弹窗loading
      })
    },
    currentChange2(val) {
      // 待出库存分页
      this.dialogPg = val
      this.showInventoryData = this.allInventoryData.slice(
        (this.dialogPg - 1) * this.dialogSize,
        this.dialogPg * this.dialogSize
      )
    },
    sizeChange2(val) {
      // 待出库存分页
      this.dialogPg = 1
      this.dialogSize = val
      this.showInventoryData = this.allInventoryData.slice(
        (this.dialogPg - 1) * this.dialogSize,
        this.dialogPg * this.dialogSize
      )
    },
    closeShowInventor() {
      this.showInventoryDialog = false
      this.dialogPg = 1
      this.dialogSize = 10
      this.dialogTotal = 0
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.getDesks()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.selectDeskId'() {
      if (this.queryForm.selectDeskId === -1) {
        this.queryForm.DeskId = 0
        this.queryForm.StockType = this.stockTypes.StockOfSummary
      } else if (this.queryForm.selectDeskId === 0) {
        this.queryForm.DeskId = 0
        this.queryForm.StockType = this.stockTypes.StockOfSurplus
      } else {
        this.queryForm.StockType = this.stockTypes.StockOfDesk
      }
      this.onSearch()
    }
  },
  components: {
    searchPanel,
    pagination,
    goodDetail,
    printOrder
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.auto-width {
  width: auto;
}
.distribution {
  width: 80%;
  margin: 10px auto;
}
.init-from-sales {
  margin-top: 10px;
}
.data-title {
  display: block;
}
.inventor-title-form {
  width: 100%;
  padding: 5px 20px;
  overflow: hidden;
  .left-title {
    margin-top: 3px;
    text-align: left;
  }
  .right-title {
    line-height: 40px;
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
.el-input-number {
  width: 100%;
}
.junk-icon:after {
  content: '旧';
  font-weight: 700;
}
.junk-icon {
  text-align: center;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background: #8b9fb7;
  color: #fff;
  display: inline-block;
  line-height: 20px;
}
.expand-talble {
  // width: 400px;
  margin: 0 auto;
  padding-left: 140px;
  padding-right: 200px;
}
.list-query-form {
  padding-bottom: 10px;
}
.log-dialog {
  .panel {
    margin: 0;
    border-top: 0;
    border-color: #ebeef5;
    .panel-bd {
      padding: 0;
      border: 0;
    }
  }
}
.btn-span {
  padding: 0 10px;
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 30px;
  z-index: 1;
}
@media screen and (max-width: 1230px) {
  .media-1230 {
    .el-select {
      width: 115px;
    }
  }
}
</style>
