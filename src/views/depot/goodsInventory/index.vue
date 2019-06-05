<template>
  <el-row class="content">
    <el-form :model="queryForm" @keyup.enter.native="onSearch" ref="search" lable-width="120px" class="item-lh-26" :rules="queryRules" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-checkbox-group v-model="showTypes" class="el-radio-group" :min="1">
            <el-checkbox :label="1" border>查看件数</el-checkbox>
            <el-checkbox :label="2" border>查看金重</el-checkbox>
            <el-checkbox :label="3" border>查看标签金额</el-checkbox>
            <!-- <el-checkbox :label="4" border>查看成本金额</el-checkbox> -->
          </el-checkbox-group>
          <el-dropdown @command="downLoad">
            <el-button>
              导出
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loadData">导出查询结果</el-dropdown-item>
              <el-dropdown-item command="loadGood">导出货品信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="BarCode">
            <el-input v-model="queryForm.BarCode" placeholder="条码" :maxlength="50" name="storeBarCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有位置：" prop="Position" v-if="characterType === CharacterType.Company">
            <el-cascader v-model="queryForm.Position" :options="positionTypeArr" :props="positionArrProps" @change="handlePosition" change-on-select name="Position"></el-cascader>
          </el-form-item>
          <el-form-item label="所有类别：" prop="FinanceType">
            <el-select v-model="queryForm.FinanceType" name="FinanceType">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="(item,index) in FinanceType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有材质：" prop="MaterialType">
            <el-select v-model="queryForm.MaterialType" name="materialType">
              <el-option label="所有材质" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有品类：" prop="CategoryType">
            <el-select v-model="queryForm.CategoryType" name="categoryType">
              <el-option label="所有品类" :value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有成色：" prop="GoldType">
            <el-select v-model="queryForm.GoldType" name="goldType">
              <el-option label="所有成色" :value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有库存：" prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" name="StockCompareType">
              <el-option label="所有库存" :value="0"></el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类型：" prop="GoodsType">
            <el-select v-model="queryForm.GoodsType" name="GoodsType">
              <el-option label="所有类型" :value="0"></el-option>
              <el-option v-for="(item, index) in GoodsType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="BarCode" label="条码：">
            <el-input v-model="queryForm.BarCode" :maxlength="50" name="BarCode"></el-input>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input v-model="queryForm.StyleCode" :maxlength="50" name="StyleCode"></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input v-model="queryForm.GoodsName" :maxlength="50" name="GoodsName"></el-input>
          </el-form-item>
          <el-form-item prop="IsJunked" label="是否旧货：">
            <el-select v-model="queryForm.IsJunked" placeholder="是否旧货" name="IsJunked">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, index) in YNStatus.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可用库存：">
            <el-col :span="11">
              <el-form-item prop="AvailableQty1" class="inline no-margin">
                <el-input v-model="queryForm.AvailableQty1" @keyup.native="queryForm.AvailableQty1 = $root.toFixed(queryForm.AvailableQty1, 0)" :maxlength="8" name="AvailableQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="AvailableQty2" class="inline no-margin">
                <el-input v-model="queryForm.AvailableQty2" @keyup.native="queryForm.AvailableQty2 = $root.toFixed(queryForm.AvailableQty2, 0)" :maxlength="8" name="AvailableQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="账面库存：">
            <el-col :span="11">
              <el-form-item prop="FinanceQty1" class="inline no-margin">
                <el-input v-model="queryForm.FinanceQty1" @keyup.native="queryForm.FinanceQty1 = $root.toFixed(queryForm.FinanceQty1, 0)" :maxlength="8" name="FinanceQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="FinanceQty2" class="inline no-margin">
                <el-input v-model="queryForm.FinanceQty2" @keyup.native="queryForm.FinanceQty2 = $root.toFixed(queryForm.FinanceQty2, 0)" :maxlength="8" name="FinanceQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="待出库存：">
            <el-col :span="11">
              <el-form-item prop="OutwaitQty1" class="inline no-margin">
                <el-input v-model="queryForm.OutwaitQty1" @keyup.native="queryForm.OutwaitQty1 = $root.toFixed(queryForm.OutwaitQty1, 0)" :maxlength="8" name="OutwaitQty1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="OutwaitQty2" class="inline no-margin">
                <el-input v-model="queryForm.OutwaitQty2" @keyup.native="queryForm.OutwaitQty2 = $root.toFixed(queryForm.OutwaitQty2, 0)" :maxlength="8" name="OutwaitQty2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="主石重（ct）：">
            <el-col :span="11">
              <el-form-item prop="Stone1Weight1" class="inline no-margin">
                <el-input v-model="queryForm.Stone1Weight1" @keyup.native="queryForm.Stone1Weight1 = $root.toFixed(queryForm.Stone1Weight1, 3)" :maxlength="10" name="Stone1Weight1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="Stone1Weight2" class="inline no-margin">
                <el-input v-model="queryForm.Stone1Weight2" @keyup.native="queryForm.Stone1Weight2 = $root.toFixed(queryForm.Stone1Weight2, 3)" :maxlength="10" name="Stone1Weight2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="标签价：">
            <el-col :span="11">
              <el-form-item prop="LabelPrice1" class="inline no-margin">
                <el-input v-model="queryForm.LabelPrice1" @keyup.native="queryForm.LabelPrice1 = $root.toFixed(queryForm.LabelPrice1, 2)" :maxlength="10" name="LabelPrice1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="LabelPrice2" class="inline no-margin">
                <el-input v-model="queryForm.LabelPrice2" @keyup.native="queryForm.LabelPrice2 = $root.toFixed(queryForm.LabelPrice2, 2)" :maxlength="10" name="LabelPrice2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="货重：">
            <el-col :span="11">
              <el-form-item prop="Weight1" class="inline no-margin">
                <el-input v-model="queryForm.Weight1" @keyup.native="queryForm.Weight1 = $root.toFixed(queryForm.Weight1, 3)" :maxlength="10" name="Weight1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="Weight2" class="inline no-margin">
                <el-input v-model="queryForm.Weight2" @keyup.native="queryForm.Weight2 = $root.toFixed(queryForm.Weight2, 3)" :maxlength="10" name="Weight2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="金重：">
            <el-col :span="11">
              <el-form-item prop="GoldWeight1" class="inline no-margin">
                <el-input v-model="queryForm.GoldWeight1" @keyup.native="queryForm.GoldWeight1 = $root.toFixed(queryForm.GoldWeight1, 3)" :maxlength="10" name="GoldWeight1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="GoldWeight2" class="inline no-margin">
                <el-input v-model="queryForm.GoldWeight2" @keyup.native="queryForm.GoldWeight2 = $root.toFixed(queryForm.GoldWeight2, 3)" :maxlength="10" name="GoldWeight2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="品牌：" prop="Brand">
            <el-input v-model="queryForm.Brand" :maxlength="50" name="Brand"></el-input>
          </el-form-item>
          <el-form-item label="供应商：" prop="PartnerName">
            <!-- <el-select v-model="queryForm.PartnerId" name="PartnerId">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.suppliers" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>-->
            <el-input v-model="queryForm.PartnerName" :maxlength="50" name="PartnerName"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="data"
      @sort-change="sortChange"
      :row-key="row => `${row.GoodsId}-${row.WarehouseId}-${row.StorechterId}`"
      :expand-row-keys="expandRows"
      @expand-change="expandRow"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="scope">
          <div class="expand-table">
            <el-table :data="expandTableData" v-loading="expandTableLoading">
              <el-table-column prop="ShelfName" label="位置" :formatter="formatter"></el-table-column>
              <el-table-column label="可用库存">
                <el-table-column prop="AvailableQty" label="件数" v-if="showTypes.indexOf(1)>-1"></el-table-column>
                <el-table-column prop label="金重" v-if="showTypes.indexOf(2)>-1">
                  <template slot-scope="props">{{$root.toFloat(scope.row.GoldWeight * props.row.AvailableQty,3) + 'g'}}</template>
                </el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf(3)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.LabelPrice * props.row.AvailableQty)}}</template>
                </el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf(4)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.CostPrice * props.row.AvailableQty)}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="账面库存">
                <el-table-column prop="FinanceQty" label="件数" v-if="showTypes.indexOf(1)>-1"></el-table-column>
                <el-table-column label="金重" v-if="showTypes.indexOf(2)>-1">
                  <template slot-scope="props">{{$root.toFloat(scope.row.GoldWeight * props.row.FinanceQty,3) + 'g'}}</template>
                </el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf(3)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.LabelPrice * props.row.FinanceQty)}}</template>
                </el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf(4)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.CostPrice * props.row.FinanceQty)}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="待出库存">
                <el-table-column prop="OutwaitQty" label="件数" v-if="showTypes.indexOf(1)>-1"></el-table-column>
                <el-table-column label="金重" v-if="showTypes.indexOf(2)>-1">
                  <template slot-scope="props">{{$root.toFloat(scope.row.GoldWeight * props.row.OutwaitQty,3) + 'g'}}</template>
                </el-table-column>
                <el-table-column label="标签金额" v-if="showTypes.indexOf(3)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.LabelPrice * props.row.OutwaitQty)}}</template>
                </el-table-column>
                <el-table-column label="成本金额" v-if="showTypes.indexOf(4)>-1">
                  <template slot-scope="props">{{'￥' + $root.toFloat(scope.row.CostPrice * props.row.OutwaitQty)}}</template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="BarCode" label="条码" width="140" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="StyleCode" label="款号" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.IsJunked === YNStatus.Yes" class="junk-icon"></span>
          {{scope.row.GoodsName}}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <el-tooltip content="可用库存=账面库存-待出库存" effect="light" placement="bottom-start">
            <span>
              可用库存
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </template>
        <el-table-column prop="AvailableQty" label="件数" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(1)>-1"></el-table-column>
        <el-table-column prop="AvailableGoldWeight" label="金重" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(2)>-1"></el-table-column>
        <el-table-column prop="AvailableLabelPrice" label="标签金额" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(3)>-1"></el-table-column>
        <el-table-column prop="AvailableCostPrice" label="成本金额" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(4)>-1"></el-table-column>
      </el-table-column>
      <el-table-column label="账面库存">
        <el-table-column prop="FinanceQty" label="件数" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(1)>-1"></el-table-column>
        <el-table-column prop="FinanceGoldWeight" label="金重" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(2)>-1"></el-table-column>
        <el-table-column prop="FinanceLabelPrice" label="标签金额" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(3)>-1"></el-table-column>
        <el-table-column prop="FinanceCostPrice" label="成本金额" :formatter="formatter" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(4)>-1"></el-table-column>
      </el-table-column>
      <el-table-column label="待出库存">
        <el-table-column prop="OutwaitQty" label="件数" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(1)>-1">
          <template slot-scope="scope">
            <el-button v-if="scope.row.OutwaitQty" type="text" @click="showOutWaitDialog(scope.row)">{{scope.row.OutwaitQty}}</el-button>
            <span v-else>{{scope.row.OutwaitQty}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OutwaitGoldWeight" label="金重" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(2)>-1">
          <template slot-scope="scope">
            <el-button v-if="scope.row.OutwaitGoldWeight" type="text" @click="showOutWaitDialog(scope.row)">{{$root.toFloat(scope.row.OutwaitGoldWeight, 3) + 'g'}}</el-button>
            <span v-else>{{$root.toFloat(scope.row.OutwaitGoldWeight, 3) + 'g'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OutwaitLabelPrice" label="标签金额" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(3)>-1">
          <template slot-scope="scope">
            <el-button v-if="scope.row.OutwaitLabelPrice" type="text" @click="showOutWaitDialog(scope.row)">{{'￥' + $root.toFloat(scope.row.OutwaitLabelPrice)}}</el-button>
            <span v-else>{{'￥' + $root.toFloat(scope.row.OutwaitLabelPrice)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OutwaitCostPrice" label="成本金额" min-width="120" show-overflow-tooltip v-if="showTypes.indexOf(4)>-1">
          <template slot-scope="scope">
            <el-button v-if="scope.row.OutwaitCostPrice" type="text" @click="showOutWaitDialog(scope.row)">{{'￥' + $root.toFloat(scope.row.OutwaitCostPrice)}}</el-button>
            <span v-else>{{'￥' + $root.toFloat(scope.row.OutwaitCostPrice)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="GoodsTypeName" label="货品类型" min-width="80"></el-table-column>
      <el-table-column prop="FinanceTypeName" label="入库类别" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName" label="位置" min-width="80" show-overflow-tooltip v-if="characterType === CharacterType.Company"></el-table-column>
      <el-table-column prop="LastTime" label="最后操作时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailDialog(scope.row.GoodsId)" name="btnShowDetail">查看</el-button>
          <el-button type="text" @click="showGoodsLog(scope.row)" name="btnShowGoodsLog">出入库记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodsVisible" :goodsId="goodsId"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" @close="setStocklogParam" @open="getStockLogData" width="800px">
      <el-table ref="logTable" :data="stockLogData" v-loading="stockLogLoading" @sort-change="logSortChnage">
        <el-table-column prop="CreateTime" label="操作时间" sortable="custom" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="EventType" label="操作类型" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PreviousCode" label="来源单号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateUser" label="操作人" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="可用库存变化" min-width="100">
          <template slot-scope="scope">{{(scope.row.AvailableQty2 > scope.row.AvailableQty1 ? '+' : '') + (scope.row.AvailableQty2 - scope.row.AvailableQty1).toFixed(0)}}</template>
        </el-table-column>
        <el-table-column prop="AvailableQty2" label="可用库存结存" min-width="100"></el-table-column>
        <el-table-column label="账面库存变化" min-width="100">
          <template slot-scope="scope">{{(scope.row.FinanceQty2 > scope.row.FinanceQty1 ? '+' : '') + (scope.row.FinanceQty2 - scope.row.FinanceQty1).toFixed(0)}}</template>
        </el-table-column>
        <el-table-column prop="FinanceQty2" label="账面库存结存" min-width="100"></el-table-column>
        <el-table-column label="待出库存变化" min-width="100">
          <template slot-scope="scope">{{(scope.row.OutwaitQty2 > scope.row.OutwaitQty1 ? '+' : '') + (scope.row.OutwaitQty2 - scope.row.OutwaitQty1).toFixed(0)}}</template>
        </el-table-column>
        <el-table-column prop="OutwaitQty2" label="待出库存结存" min-width="100"></el-table-column>
        <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="stockLogParam.PageIndex" :size="stockLogParam.PageSize" :total="stockLogTotal" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
    </el-dialog>
    <!-- end 出入库记录 -->

    <el-dialog title="待出库存" :visible.sync="outWaitVisible" @open="getOutWaitData">
      <div>
        <div class="m-b-10">条码{{outWaitBasic.BarCode}}有出库待审核的单据，所以存在待出库存。以下为相关的出库待审核单据：</div>
        <el-table :data="outWaidData" v-loading="outWaitLoading">
          <el-table-column prop="OrderTypeName" label="单据类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OrderCode" label="相关单号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateTime" label="操作时间" :formatter="formatter" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="ExportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>

    <export-goods-detail :visible.sync="goodsExportVisible" @submit="downLoadGoods"/>
  </el-row>
</template>

<script>
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  FinanceType,
  GoodsType,
  StockCompareType,
  GoodsStockWarehousePositionType,
  GoodsStockLogEventType,
  GoodsStockLogOrderType,
  GoodsStockLogPositionType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSTOTAL,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_GETS,
  STOCKING_API_GOODS_STOCK_SHELF_GETS,
  STOCKING_API_GOODS_STOCK_DESK_GETS,
  STOCKING_API_GOODS_STOCK_LOG_GETS,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSRESULT,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSGOODS,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_REQOUTWAITS
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goodDetail from '@/components/erp/goodDetail'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import exportGoodsDetail from '@/components/erp/exportGoodsDetail'

export default {
  data() {
    return {
      GoodsStockWarehousePositionType,
      CharacterType,
      YNStatus,
      FinanceType,
      StockCompareType,
      GoodsType,
      showTypes: [1, 2],
      positionTypeArr: [],
      positionArrProps: {
        value: 'Id',
        label: 'Value',
        children: 'children'
      },
      expandTableLoading: false,
      expandTableData: [],
      expandRows: [],
      stockLogData: [],
      stockLogTotal: 0,
      stockLogLoading: false,
      stockLogParam: {
        GoodsId: 0,
        PositionType: '',
        WarehouseId: '',
        StorechterId: '',
        PageIndex: 1,
        PageSize: 10,
        IsAsced: YNStatus.No
      },
      queryForm: {
        // 查询表单数据
        IsJunked: 0,
        Position: [0],
        PositionType: 0,
        StorechterId: 0,
        WarehouseId: 0,
        FinanceType: 0,
        MaterialType: 0,
        CategoryType: 0,
        GoodsType: 0,
        GoldType: 0,
        // PartnerId: 0,
        StockCompareType: StockCompareType.FinanceQtyThanZero,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PartnerName: '',
        Brand: '',
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        AvailableQty1: '',
        AvailableQty2: '',
        FinanceQty1: '',
        FinanceQty2: '',
        OutwaitQty1: '',
        OutwaitQty2: '',
        Stone1Weight1: '',
        Stone1Weight2: '',
        LabelPrice1: '',
        LabelPrice2: '',
        Weight1: '',
        Weight2: '',
        GoldWeight1: '',
        GoldWeight2: '',
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
        OutwaitQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.OutwaitQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.OutwaitQty2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        OutwaitQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.OutwaitQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.OutwaitQty1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
        Stone1Weight1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                this.queryForm.Stone1Weight2 &&
                parseFloat(value) > parseFloat(this.queryForm.Stone1Weight2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        Stone1Weight2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                this.queryForm.Stone1Weight1 &&
                parseFloat(value) < parseFloat(this.queryForm.Stone1Weight1)
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
                this.queryForm.LabelPrice1 &&
                parseFloat(value) < parseFloat(this.queryForm.LabelPrice1)
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
                this.queryForm.Weight1 &&
                parseFloat(value) < parseFloat(this.queryForm.Weight1)
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
                this.queryForm.GoldWeight1 &&
                parseFloat(value) < parseFloat(this.queryForm.GoldWeight1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
      parameters: {},
      data: [],
      total: 0,
      goodsSum: {},
      goodsLogDialog: false, // 出入库记录对话框
      goodsId: '',
      goodsVisible: false,
      outWaitVisible: false,
      outWaitBasic: {},
      outWaidData: [],
      exportColumns: [
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
          FieldEnName: 'AvailableQty',
          FieldCnName: '可用库存件数',
        },
        {
          FieldEnName: 'AvailableGoldWeight',
          FieldCnName: '可用库存金重',
          Precision: 3,
        },
        {
          FieldEnName: 'AvailableLabelPrice',
          FieldCnName: '可用库存标签金额',
          Precision: 2,
        },
        {
          FieldEnName: 'AvailableCostPrice',
          FieldCnName: '可用库存成本金额',
          Precision: 2,
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存件数',
        },
        {
          FieldEnName: 'FinanceGoldWeight',
          FieldCnName: '账面库存金重',
          Precision: 3,
        },
        {
          FieldEnName: 'FinanceLabelPrice',
          FieldCnName: '账面库存标签金额',
          Precision: 2,
        },
        {
          FieldEnName: 'FinanceCostPrice',
          FieldCnName: '账面库存成本金额',
          Precision: 2,
        },
        {
          FieldEnName: 'OutwaitQty',
          FieldCnName: '待出库存件数',
        },
        {
          FieldEnName: 'OutwaitGoldWeight',
          FieldCnName: '待出库存金重',
          Precision: 3,
        },
        {
          FieldEnName: 'OutwaitLabelPrice',
          FieldCnName: '待出库存标签金额',
          Precision: 2,
        },
        {
          FieldEnName: 'OutwaitCostPrice',
          FieldCnName: '待出库存成本金额',
          Precision: 2,
        },
        {
          FieldEnName: 'GoodsTypeName',
          FieldCnName: '货品类型',
        },
        {
          FieldEnName: 'FinanceTypeName',
          FieldCnName: '入库类别',
        },
        {
          FieldEnName: 'WarehouseName',
          FieldCnName: '位置',
        },
        {
          FieldEnName: 'LastTime',
          FieldCnName: '最后操作时间',
        },
      ],
      ExportVisible: false,
      goodsExportVisible: false,
      outWaitLoading: false
    }
  },
  components: {
    searchPanel,
    pagination,
    goodDetail,
    baseExportFieldSetter,
    exportGoodsDetail
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    ExportColumns() {
      if (this.characterType === CharacterType.Store) {
        return this.exportColumns.filter(item => item.FieldEnName !== 'WarehouseName')
      } else {
        return this.exportColumns
      }
    }
  },
  created() {
    this.getStoreAllType()
    this.getPositionTypeArr()
  },
  mounted() {
    this.init()
    // this.getTotal()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    // 是否显示expend列
    // isShowExpand({row, column, rowIndex}) {
    //   // console.log(row)
    //   //  
    //   if (column.type === 'expand' && !(row.PositionType !== GoodsStockWarehousePositionType.Store && this.characterType === CharacterType.Company || this.characterType === CharacterType.Store)) {
    //     return 'hide-expand'
    //   } else {
    //     return ''
    //   }
    // },
    showOutWaitDialog(row) {
      this.outWaitVisible = true
      this.outWaitBasic = row
    },
    getOutWaitData() {
      this.outWaitLoading = true
      STOCKING_API_GOODS_STOCK_WAREHOUSE_REQOUTWAITS({
        StorechterId: this.outWaitBasic.StorechterId,
        WarehouseId: this.outWaitBasic.WarehouseId,
        ShelfId: 0,
        DeskId: 0,
        GoodsId: this.outWaitBasic.GoodsId,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.outWaidData = res.data.Data
        }
        this.outWaitLoading = false
      })
    },
    showGoodsLog(row) {
      if (row.PositionType === GoodsStockWarehousePositionType.Warehouse) {
        this.stockLogParam.PositionType = GoodsStockLogPositionType.Warehouse
        this.stockLogParam.WarehouseId = row.WarehouseId
        this.stockLogParam.StorechterId = 0
      } else {
        this.stockLogParam.PositionType = GoodsStockLogPositionType.Store
        this.stockLogParam.StorechterId = row.StorechterId
        this.stockLogParam.WarehouseId = 0
      }
      this.stockLogParam.GoodsId = row.GoodsId
      this.goodsLogDialog = true
    },
    logSortChnage({ order }) {
      this.stockLogParam.IsAsced = order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getStockLogData()
    },
    setStocklogParam() {
      this.$refs.logTable.clearSort()
      this.stockLogParam.PageIndex = 1
      this.stockLogParam.PageSize = 10
      this.stockLogParam.IsAsced = YNStatus.No
    },
    getStockLogData() {
      this.stockLogLoading = true
      STOCKING_API_GOODS_STOCK_LOG_GETS(this.stockLogParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.stockLogData = res.data.Data.Rows
          this.stockLogTotal = res.data.Data.Count
        }
        this.stockLogLoading = false
      })
    },
    goodsLogPageChange(val) {
      this.stockLogParam.PageIndex = val
      this.getStockLogData()
    },
    goodsLogPageSizeChange(val) {
      this.stockLogParam.PageIndex = 1
      this.stockLogParam.PageSize = val
      this.getStockLogData()
    },
    expandRow(row, expandedRows) {
      this.expandTableLoading = true
      this.expandRows = []
      //  && (row.PositionType !== GoodsStockWarehousePositionType.Store && this.characterType === CharacterType.Company || this.characterType === CharacterType.Store)
      if (expandedRows.some(item => `${item.GoodsId}-${item.WarehouseId}-${item.StorechterId}` === `${row.GoodsId}-${row.WarehouseId}-${row.StorechterId}`)) {
        this.expandRows.push(`${row.GoodsId}-${row.WarehouseId}-${row.StorechterId}`)
        let result
        if (row.PositionType === GoodsStockWarehousePositionType.Warehouse) {
          result = STOCKING_API_GOODS_STOCK_SHELF_GETS({
            WarehouseId: row.WarehouseId,
            GoodsId: row.GoodsId
          })
        } else {
          result = STOCKING_API_GOODS_STOCK_DESK_GETS({
            CharacterId: row.StorechterId,
            GoodsId: row.GoodsId
          })
        }
        result.then(res => {
          this.expandTableLoading = false
          if (res.data.Code === 'CORRECT') {
            this.expandTableData = res.data.Data.Rows
          }
        })
      }
    },
    showDetailDialog(goodsId) {
      this.goodsId = goodsId
      this.goodsVisible = true
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            IsJunked: 0,
            Position: [0],
            PositionType: 0,
            StorechterId: 0,
            WarehouseId: 0,
            FinanceType: 0,
            MaterialType: 0,
            CategoryType: 0,
            GoodsType: 0,
            GoldType: 0,
            // PartnerId: 0,
            StockCompareType: StockCompareType.FinanceQtyThanZero,
            IsAsced: YNStatus.No,
            OrderBy: 0,
            PartnerName: '',
            Brand: '',
            BarCode: '',
            StyleCode: '',
            GoodsName: '',
            AvailableQty1: '',
            AvailableQty2: '',
            FinanceQty1: '',
            FinanceQty2: '',
            OutwaitQty1: '',
            OutwaitQty2: '',
            Stone1Weight1: '',
            Stone1Weight2: '',
            LabelPrice1: '',
            LabelPrice2: '',
            Weight1: '',
            Weight2: '',
            GoldWeight1: '',
            GoldWeight2: '',
            PageIndex: 1,
            PageSize: 20
          }
      query.Position = query.Position.length === 1 ? [parseInt(query.Position)] : query.Position.map(val => parseInt(val))
      query.IsJunked = parseInt(query.IsJunked)
      query.PositionType = parseInt(query.PositionType)
      query.StorechterId = parseInt(query.StorechterId)
      query.WarehouseId = parseInt(query.WarehouseId)
      query.FinanceType = parseInt(query.FinanceType)
      query.MaterialType = parseInt(query.MaterialType)
      query.CategoryType = parseInt(query.CategoryType)
      query.GoodsType = parseInt(query.GoodsType)
      query.GoldType = parseInt(query.GoldType)
      query.StockCompareType = parseInt(query.StockCompareType)
      // query.PartnerId = parseInt(query.PartnerId)
      query.OrderBy = parseInt(query.OrderBy)
      query.IsAsced = parseInt(query.IsAsced)
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = Object.assign({}, query)
      this.queryForm = { ...this.parameters }
      this.getData()
      this.getTotal()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let params = { ...this.parameters }
      params.Stone1Weight1 = this.$root.toInt(params.Stone1Weight1)
      params.Stone1Weight2 = this.$root.toInt(params.Stone1Weight2)
      params.LabelPrice1 = this.$root.toInt(params.LabelPrice1)
      params.LabelPrice2 = this.$root.toInt(params.LabelPrice2)
      params.Weight1 = this.$root.toInt(params.Weight1)
      params.Weight2 = this.$root.toInt(params.Weight2)
      params.GoldWeight1 = this.$root.toInt(params.GoldWeight1)
      params.GoldWeight2 = this.$root.toInt(params.GoldWeight2)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_GETS(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.expandRows = [] // 重新请求数据时，重置展开行
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if (this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    handlePosition(val) {
      this.queryForm.PositionType = val[0]
      if (val.length === 2) {
        if (
          this.queryForm.PositionType ===
          GoodsStockWarehousePositionType.Warehouse
        ) {
          this.queryForm.StorechterId = 0
          this.queryForm.WarehouseId = val[1]
        } else {
          this.queryForm.StorechterId = val[1]
          this.queryForm.WarehouseId = 0
        }
      } else {
        this.queryForm.StorechterId = 0
        this.queryForm.WarehouseId = 0
      }
    },
    onSearch() {
      // 搜索相关
      this.$refs.search.validate(valid => {
        if (valid) {
          this.queryForm.isSenior = true
          if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
            this.getData()
            this.getTotal()
          } else {
            this.parameters = { ...this.queryForm }
            this.initRoute()
          }
        }
      })
      this.queryForm.PageIndex = 1

    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.handlePosition(this.queryForm.Position)
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
        path: this.$router.path,
        query: this.parameters
      })
    },
    formatter(row, columns, val) {
      // 表格格式化
      switch (columns.property) {
        case 'ShelfName':
          return val || row.DeskName
        case 'GoodsType':
          return GoodsType.Types[val]
        case 'FinanceType':
          return FinanceType.Types[val]
        case 'LastTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'EventType':
          return GoodsStockLogOrderType.Types[row.OrderType] + '(' + GoodsStockLogEventType.Types[val] + ')'
        case 'Quantity':
          return val === 0 ? val : val > 0 ? '+' + val : val
        case 'FinanceGoldWeight':
        case 'AvailableGoldWeight':
          return this.$root.toFloat(val, 3) + 'g'
        case 'FinanceCostPrice':
        case 'FinanceLabelPrice':
        case 'AvailableCostPrice':
        case 'AvailableLabelPrice':
          return '￥' + this.$root.toFloat(val)
        default:
          break
      }
    },
    getSummaries(param) {
      // 自定义合计列
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          return (sums[0] = '合计')
        }
        switch (column.property) {
          case 'FinanceQty':
            sums[index] = this.goodsSum.FinanceQty
            break
          case 'FinanceCostPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.FinanceCostPrice)
            break
          case 'FinanceGoldWeight':
            sums[index] = this.$root.toFloat(this.goodsSum.FinanceGoldWeight, 3) + 'g'
            break
          case 'FinanceLabelPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.FinanceLabelPrice)
            break
          case 'AvailableCostPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.AvailableCostPrice)
            break
          case 'AvailableGoldWeight':
            sums[index] = this.$root.toFloat(this.goodsSum.AvailableGoldWeight, 3) + 'g'
            break
          case 'AvailableLabelPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.AvailableLabelPrice)
            break
          case 'AvailableQty':
            sums[index] = this.goodsSum.AvailableQty
            break
          case 'OutwaitCostPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.OutwaitCostPrice)
            break
          case 'OutwaitGoldWeight':
            sums[index] = this.$root.toFloat(this.goodsSum.OutwaitGoldWeight, 3) + 'g'
            break
          case 'OutwaitLabelPrice':
            sums[index] = '￥' + this.$root.toFloat(this.goodsSum.OutwaitLabelPrice)
            break
          case 'OutwaitQty':
            sums[index] = this.goodsSum.OutwaitQty
            break
          default:
            sums[index] = ''
            break
        }
      })
      return sums
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'LastTime':
          this.parameters.OrderBy = 0
          break
        case 'BarCode':
          this.parameters.OrderBy = 1
          break
        case 'StyleCode':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 0
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
    },
    getTotal() {
      let params = { ...this.parameters }
      params.Stone1Weight1 = this.$root.toInt(params.Stone1Weight1)
      params.Stone1Weight2 = this.$root.toInt(params.Stone1Weight2)
      params.LabelPrice1 = this.$root.toInt(params.LabelPrice1)
      params.LabelPrice2 = this.$root.toInt(params.LabelPrice2)
      params.Weight1 = this.$root.toInt(params.Weight1)
      params.Weight2 = this.$root.toInt(params.Weight2)
      params.GoldWeight1 = this.$root.toInt(params.GoldWeight1)
      params.GoldWeight2 = this.$root.toInt(params.GoldWeight2)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSTOTAL(params).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.goodsSum = res.data.Data
          }
        }
      )
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      // this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    getPositionTypeArr() {
      this.positionTypeArr = GoodsStockWarehousePositionType.TypeArray.map(
        item => {
          return {
            Id: item.KeyId,
            Value: item.Value,
            children: []
          }
        }
      )
      this.positionTypeArr.unshift({
        Id: 0,
        Value: '所有位置'
      })
      this.$store
        .dispatch('GET_STORES_DROPLIST')
        .then(res => {
          this.positionTypeArr.forEach((item, index) => {
            if (item.Id === GoodsStockWarehousePositionType.Store) {
              this.positionTypeArr[index].children = res.map(item => {
                return {
                  Id: item.CharacterId,
                  Value: item.Value
                }
              })
            }
          })
        })
        .then(
          this.$store.dispatch('GET_WAREHOUSES_DROPLIST').then(res => {
            this.positionTypeArr.forEach((item, index) => {
              if (item.Id === GoodsStockWarehousePositionType.Warehouse) {
                this.positionTypeArr[index].children = res.filter(item => item.State === YNStatus.Yes)
              }
            })
          })
        )
    },
    downLoad(command) {

      if (command === 'loadData') {
        this.ExportVisible = true
      } else if (command === 'loadGood') {
        this.goodsExportVisible = true
      }
    },
    downLoadData(column) {
      let param = { ...this.queryForm }
      param.PageIndex = 1
      param.PageSize = 0
      param.ExportColumns = column
      param.AvailableQty1 = parseInt(param.AvailableQty1) || 0
      param.AvailableQty2 = parseInt(param.AvailableQty2) || 0
      param.FinanceQty1 = parseInt(param.FinanceQty1) || 0
      param.FinanceQty2 = parseInt(param.FinanceQty2) || 0
      param.AvailableQty1 = parseInt(param.AvailableQty1) || 0
      param.AvailableQty2 = parseInt(param.AvailableQty2) || 0
      param.OutwaitQty1 = parseInt(param.OutwaitQty1) || 0
      param.OutwaitQty2 = parseInt(param.OutwaitQty2) || 0
      param.Stone1Weight1 = this.$root.toInt(param.Stone1Weight1)
      param.Stone1Weight2 = this.$root.toInt(param.Stone1Weight2)
      param.LabelPrice1 = this.$root.toInt(param.LabelPrice1)
      param.LabelPrice2 = this.$root.toInt(param.LabelPrice2)
      param.Weight1 = this.$root.toInt(param.Weight1)
      param.Weight2 = this.$root.toInt(param.Weight2)
      param.GoldWeight1 = this.$root.toInt(param.GoldWeight1)
      param.GoldWeight2 = this.$root.toInt(param.GoldWeight2)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSRESULT(param).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
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
      })
    },
    downLoadGoods(column) {
      let param = { ...this.queryForm }
      param.PageIndex = 1
      param.PageSize = 0
      param.ExportColumns = column
      param.AvailableQty1 = parseInt(param.AvailableQty1) || 0
      param.AvailableQty2 = parseInt(param.AvailableQty2) || 0
      param.FinanceQty1 = parseInt(param.FinanceQty1) || 0
      param.FinanceQty2 = parseInt(param.FinanceQty2) || 0
      param.AvailableQty1 = parseInt(param.AvailableQty1) || 0
      param.AvailableQty2 = parseInt(param.AvailableQty2) || 0
      param.OutwaitQty1 = parseInt(param.OutwaitQty1) || 0
      param.OutwaitQty2 = parseInt(param.OutwaitQty2) || 0
      param.Stone1Weight1 = this.$root.toInt(param.Stone1Weight1)
      param.Stone1Weight2 = this.$root.toInt(param.Stone1Weight2)
      param.LabelPrice1 = this.$root.toInt(param.LabelPrice1)
      param.LabelPrice2 = this.$root.toInt(param.LabelPrice2)
      param.Weight1 = this.$root.toInt(param.Weight1)
      param.Weight2 = this.$root.toInt(param.Weight2)
      param.GoldWeight1 = this.$root.toInt(param.GoldWeight1)
      param.GoldWeight2 = this.$root.toInt(param.GoldWeight2)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSGOODS(param).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
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
        this.goodsExportVisible = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
// .inventor-title-form {
//   width: 100%;
//   padding: 5px 20px;
//   overflow: hidden;
//   .left-title {
//     margin-top: 3px;
//     text-align: left;
//   }
//   .right-title {
//     line-height: 40px;
//     text-align: right;
//     span {
//       margin-right: 10px;
//       font-size: 14px;
//       b {
//         font-size: 16px;
//       }
//     }
//   }
// }
// .el-input-number {
//   width: 100%;
// }
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
.expand-table {
  margin: 0 auto;
  padding: 0 140px;
}
// .list-query-form {
//   padding-bottom: 10px;
// }
// .log-dialog {
//   .panel {
//     margin: 0;
//     border-top: 0;
//     border-color: #ebeef5;
//     .panel-bd {
//       padding: 0;
//       border: 0;
//     }
//   }
// }
// .btn-span {
//   padding: 0 10px;
//   width: 100%;
//   height: 100%;
//   display: inline-block;
//   position: absolute;
//   top: 0;
//   left: 0;
//   line-height: 30px;
//   z-index: 1;
// }
// @media screen and (max-width: 1230px) {
//   .media-1230 {
//     .el-select {
//       width: 115px;
//     }
//   }
// }
</style>
<style lang="scss">
.hide-expand {
  .cell {
    display: none;
  }
}
</style>

