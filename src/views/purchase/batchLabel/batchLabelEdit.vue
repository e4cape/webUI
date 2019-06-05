<template>
  <div class="content">
    <div class="panel">
      <div class="panel-tag">
        <span class="title">编辑打印单</span>
        <el-button name="btnEditDialog" type="text" class="el-back" @click="newEndProduct">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.PrintCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">打印原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="16">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input name="code" v-model="code" placeholder="录入/扫描条码" :maxlength="50" @keyup.native.enter="codeEnter"></el-input>
                </el-col>
                <el-col :span="16" class="tl">
                  <el-button name="btnMultiCodeVisible" type="primary" @click="multiCodeVisible=true">批量录入</el-button>
                  <el-button name="btnJunkCreateDialog" type="primary" @click="selectGoods">选择货品</el-button>
                  <el-dropdown name="handleCommand" @command="openReiseDialog">
                    <span class="el-dropdown-link">
                      <el-button>
                        提单
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="purchaseList">成品进货入库单</el-dropdown-item>
                      <el-dropdown-item command="pricingList">成品调价单</el-dropdown-item>
                      <el-dropdown-item command="modifyList">成品修改单</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="tr">
              <span class="detail-info-num-item">
                条码数量：
                <b class="num">{{detail.ItemQty}}</b>
              </span>
              <span class="detail-info-num-item">
                库存：
                <b class="num">{{detail.PrintQty}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <!-- @module 数据表格 -->
        <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="JunkCode" label="条码" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span name="GoodsId" class="init-button-text" @click="checkGold(scope.row.GoodsId)">{{scope.row.BarCode}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="$store.getters.user_session.CharacterType === characterType.Company" prop="Location" label="位置" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="材质" min-width="80">
            <template slot-scope="scope">{{materialType.Types[scope.row.MaterialType]}}</template>
          </el-table-column>
          <el-table-column prop="LabelPrice" label="标签价" min-wdith="120">
            <template slot-scope="scope">{{$root.toFloat(scope.row.LabelPrice)}}</template>
          </el-table-column>
          <el-table-column label="零售方式" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{retailType.Types[scope.row.RetailType]}}</template>
          </el-table-column>
          <el-table-column prop="RetailPrice" label="零售价/工费" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{$root.toFloat(scope.row.RetailPrice)}}</template>
          </el-table-column>
          <el-table-column prop="FinanceQty" label="库存" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.FinanceQty}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button name="btnDelGood" type="text" @click="delGood(scope.row.ItemId, scope.row.PrintId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button name="btnPrinting" type="primary" @click="$router.push({path:'/purchase/batchLabel/printing',query:{id: printId}})">打印</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>

    <!-- @module Dialog·修改打印单 -->
    <!-- <basic-edit :title="'修改打印单基本信息'" v-if="editDialog" :editDialog="editDialog" :editForm="editForm" @listenEditDialog="listenEditDialog"></basic-edit> -->
    <!-- End Dialog·新建打印单 -->

    <!-- dialog 货品详情 -->
    <good-details v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-details>
    <!-- end 货品详情-->

    <!-- dialog 批量录入条码 -->
    <template v-if="multiCodeVisible">
      <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    </template>
    <!-- End 批量录入条码 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->

    <!-- 选择货品 -->
    <el-dialog v-if="selectGoodsVisible" title="选择货品" :visible.sync="selectGoodsVisible" width="1200px" :before-close="selectGoodsColse">
      <el-form :model="selectForm" ref="selectGoods" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="StockCompareType">
              <el-select filterable name="StockCompareType" v-model="selectForm.StockCompareType" placeholder="所有库存" @change="onSearch">
                <el-option label="所有库存" :value="0"></el-option>
                <el-option v-for="(item, index) in stockCompareType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="MaterialType">
              <el-select filterable name="MaterialType" v-model="selectForm.MaterialType" placeholder="所有材质" @change="onSearch">
                <el-option label="所有材质" :value="0"></el-option>
                <el-option v-for="(item, index) in materialType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="CategoryType">
              <el-select filterable name="CategoryType" v-model="selectForm.CategoryType" placeholder="所有品类" @change="onSearch">
                <el-option label="所有品类" :value="0"></el-option>
                <el-option v-for="(item, index) in categoryType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="GoldType">
              <el-select filterable name="GoldType" v-model="selectForm.GoldType" placeholder="所有成色" @change="onSearch">
                <el-option label="所有成色" :value="0"></el-option>
                <el-option v-for="(item, index) in goldType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="FinanceType">
              <el-select filterable name="FinanceType" v-model="selectForm.FinanceType" placeholder="所有类别" @change="onSearch">
                <el-option label="所有类别" :value="0"></el-option>
                <el-option v-for="(item, index) in financeType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="BarCode">
              <el-input name="BarCode" v-model="selectForm.BarCode" :maxlength="50" @keyup.enter.native="onSearch" placeholder="请输入条码">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="selectData" element-loading-text="拼命加载中" @selection-change="selectGoodsCurrChange" v-loading="$store.getters.tb_loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceType" label="类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{financeType.Types[scope.row.FinanceType]}}
          </template>
        </el-table-column>
        <el-table-column label="位置" min-width="80" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType === characterType.Company">
          <template slot-scope="scope">
            {{positionType.Types[scope.row.PositionType]}}
          </template>
        </el-table-column>
        <el-table-column prop="Weight" label="货重" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoldWeight" label="净金重" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AvailableQty" label="可用库存" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination :pg="selectForm.PageIndex" :size="selectForm.PageSize" :total="selecTotal" @currentChange="selectPageChange" @sizeChange="selectPageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelectGoods(false)" :disabled="currentRow.length ? false : true">添 加</el-button>
        <el-button type="primary" @click="confirmSelectGoods(true)" :disabled="currentRow.length ? false : true">添加并关闭</el-button>
        <el-button @click="selectGoodsColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 选择货品 -->
    <!-- 成品采购入库单 -->
    <el-dialog v-if="reiseVisible" title="选择成品采购单" :visible.sync="reiseVisible" width="1200px" :before-close="colseReise">
      <el-form :model="raiseForm" ref="selectReise" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="PartnerName">
              <el-select filterable name="PartnerName" v-model="raiseForm.PartnerName" placeholder="所有供应商" @change="getReiseData">
                <el-option label="所有供应商" value></el-option>
                <template v-for="(item, index) in supplierList">
                  <el-option v-if="item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier " :key="index" :label="item.Value" :value="String(item.Value)"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="IntakeCode">
              <el-input name="IntakeCode" v-model="raiseForm.IntakeCode" :maxlength="50" @keyup.enter.native="getReiseData" placeholder="请输入单据编号">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getReiseData"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="raiseData" element-loading-text="拼命加载中" highlight-current-row @current-change="handleCurrentChange" v-loading="$store.getters.tb_loading">
        <el-table-column prop="IntakeCode" label="单据编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IntakeQty" label="采购数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckTime" label="最后操作时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
        </el-table-column>
      </el-table>
      <pagination :pg="raiseForm.PageIndex" :size="raiseForm.PageSize" :total="raiseTotal" @currentChange="resisePageChange" @sizeChange="resisePageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmReise">确 定</el-button>
        <el-button @click="colseReise">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 成品采购入库单 -->
    <!-- 成品调价单 -->
    <el-dialog v-if="priceVisible" title="选择成品调价单" :visible.sync="priceVisible" width="1200px" :before-close="colsePrice">
      <el-form :model="priceOrderForm" ref="selectPriceOrder" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="ReasonTypeDk">
              <el-select filterable name="ReasonTypeDk" v-model="priceOrderForm.ReasonTypeDk" placeholder="所有原因" @change="getPriceData">
                <el-option label="所有原因" :value="0"></el-option>
                <el-option v-for="(item, index) in priceOrderList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="CreateUserId">
              <el-select filterable name="CreateUserId" v-model="priceOrderForm.CreateUserId" placeholder="所有创建人" @change="getPriceData">
                <el-option label="所有创建人" :value="0"></el-option>
                <el-option v-for="(item, index) in usersList" :key="index" :label="item.TrueName" :value="Number(item.UserId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="PriceCode">
              <el-input name="PriceCode" v-model="priceOrderForm.PriceCode" :maxlength="50" @keyup.enter.native="getPriceData" placeholder="请输入单据编号">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getPriceData"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="priceData" @sort-change="priceSort" element-loading-text="拼命加载中" highlight-current-row @current-change="priceCurrentChange" v-loading="$store.getters.tb_loading">
        <el-table-column prop="PriceCode" label="单据编号" sortable="custom" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ReasonTypeDv" label="调价原因" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" sortable="custom" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="调价条码数" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckTime" label="最后操作时间" sortable="custom" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
        </el-table-column>
      </el-table>
      <pagination :pg="priceOrderForm.PageIndex" :size="priceOrderForm.PageSize" :total="priceTotal" @currentChange="pricePageChange" @sizeChange="pricePageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmPrice">确 定</el-button>
        <el-button @click="colsePrice">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 成品调价单 -->
    <!-- 成品修改单 -->
    <el-dialog v-if="modifyVisible" title="选择成品修改单" :visible.sync="modifyVisible" width="1200px" :before-close="colseModify">
      <el-form :model="modifyOrderForm" ref="selectModifyOrder" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="ReasonTypeDk">
              <el-select filterable name="ReasonTypeDk" v-model="modifyOrderForm.ReasonTypeDk" placeholder="所有原因" @change="getModifyData">
                <el-option label="所有原因" :value="0"></el-option>
                <el-option v-for="(item, index) in modifyOrderList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="CreateUserId">
              <el-select filterable name="CreateUserId" v-model="modifyOrderForm.CreateUserId" placeholder="所有创建人" @change="getModifyData">
                <el-option label="所有创建人" :value="0"></el-option>
                <el-option v-for="(item, index) in usersList" :key="index" :label="item.TrueName" :value="Number(item.UserId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ModifyCode">
              <el-input name="ModifyCode" v-model="modifyOrderForm.ModifyCode" :maxlength="50" @keyup.enter.native="getModifyData" placeholder="请输入单据编号">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getModifyData"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="modifyData" @sort-change="modifySort" element-loading-text="拼命加载中" highlight-current-row @current-change="modifyCurrentChange" v-loading="$store.getters.tb_loading">
        <el-table-column prop="ModifyCode" sortable="custom" label="单据编号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ReasonTypeDv" label="修改原因" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" sortable="custom" label="创建时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="条码数" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckTime" sortable="custom" label="最后操作时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
        </el-table-column>
      </el-table>
      <pagination :pg="modifyOrderForm.PageIndex" :size="modifyOrderForm.PageSize" :total="modifyTotal" @currentChange="modifyPageChange" @sizeChange="modifyPageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmModify">确 定</el-button>
        <el-button @click="colseModify">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 成品修改单 -->
    <el-dialog v-if="newVisible" title="修改打印单" :visible.sync="newVisible" width="600px" :before-close="newOrderDialogColse">
      <el-form :model="editForm" :rules="newOrderRules" ref="newOrder" lable-width="120px" class="item-lh-26" :inline="true">
        <div>
          <el-form-item label="打印原因：" prop="ReasonTypeDk" class="m-b-20">
            <el-select filterable name="ReasonTypeDk" v-model="editForm.ReasonTypeDk" placeholder="请选择" @change="reasonTypeChange">
              <el-option v-for="(item, index) in reasonsList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
            <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
              <i class="icon-set"></i>
            </span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" v-model="editForm.Note" @blur="editForm.Note = editForm.Note.trim()" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- @module Dialog·新建修改原因 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="reasonsList" dialogTitle="打印原因" :dictType="SettingDictionaryDictType.GoodsPrintOrderBasicReasonType" @listenDictSave="getReturn"></dict-manage>
    <!-- End Dialog·新建修改原因  -->
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
  </div>
</template>

<script>
import {
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSFORGOODS,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_CREATE,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTPRICECREATE,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_UPDATE,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_DELETE,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTMODIFYCREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
  MERCHANT_API_DROPDOWN_USERLIST
} from '@/apis/merchant.js'
import { YNStatus, EnableState, PartnerType, CharacterType } from '@/enums/common.js'
import {
  StockCompareType,
  FinanceType,
  MaterialType,
  CategoryType,
  GoldType,
  RetailType,
  GoodsBasicState,
  GoodsPriceOrderBasicState,
  SettingDictionaryDictType,
  GoodsPrintOrderBasicState,
  GoodsStockWarehousePositionType
} from '@/enums/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetails from '@/components/purchase/goodsDetails'
// import basicEdit from './printBasicEdit'
import SelectGoods from '@/components/erp/selectGoods'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goldCheck from '@/components/erp/goldCheck'
import dictManage from '@/components/erp/dictManage'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
export default {
  data() {
    return {
      positionType: GoodsStockWarehousePositionType,
      characterType: CharacterType,
      partnerType: PartnerType,
      orderBasicState: GoodsPrintOrderBasicState,
      SettingDictionaryDictType,
      YNStatus,
      materialType: MaterialType,
      categoryType: CategoryType,
      stockCompareType: StockCompareType,
      goldType: GoldType,
      financeType: FinanceType,
      retailType: RetailType,
      goodsData: [], // 货品数据
      size: 20, // 分页数据条数
      pg: 1, // 当前页面位置
      total: 0, // 总数据条数
      printId: '',
      detail: {},
      code: '',
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      checkParams: {
        type: false,
        id: ''
      },
      editDialog: false,
      multiCodeVisible: false, // 批量录入条码弹窗
      checkDialog: false,
      ladingBill: {
        visible: false, // 成品采购
        billType: ''
      },
      selectGoodsVisible: false, // 选择货品弹窗
      selectForm: {
        // PositionType: this.$store.getters.user_session.CharacterType === CharacterType.Company ? GoodsStockWarehousePositionType.Warehouse : 0,
        WarehouseId: 0,
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        FinanceType: 0,
        BarCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        State: GoodsBasicState.Audit,
        PageIndex: 1,
        PageSize: 20
      }, // 选择货品
      selecTotal: 0, // 选择货品总数
      selectData: [], // 选择货品数据
      currentRow: [], // 选中的货品
      supplierList: [], // 供应商下拉
      reiseVisible: false, // 成品采购弹窗
      raiseData: [], // 成品采购数据
      raiseTotal: 0, // 成品采购数据总数
      raiseForm: {
        PartnerName: '',
        IntakeCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        State: 0,
        PageIndex: 1,
        PageSize: 20
      },
      raiseOrderRow: null, // 成品采购选中
      priceVisible: false, // 成品调价单
      priceOrderForm: {
        PriceCode: '',
        CreateUserId: 0,
        ReasonTypeDk: 0,
        OrderBy: 0,
        State: GoodsPriceOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      priceData: [],
      priceTotal: 0,
      priceOrderRow: null, // 成品调价单选中
      priceOrderList: [], // 成品调价原因下拉
      usersList: [], // 创建人下拉
      modifyVisible: false, // 成品修改单
      modifyOrderForm: {
        PriceCode: '',
        CreateUserId: 0,
        ReasonTypeDk: 0,
        OrderBy: 0,
        State: GoodsPriceOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      modifyData: [],
      modifyTotal: 0,
      modifyOrderRow: null, // 成品修改单选中
      modifyOrderList: [], // 成品修改单原因下拉
      editForm: {
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: ''
      }, // 修改成品入库单
      newOrderRules: {
        ReasonTypeDk: [
          { required: true, message: '请选择打印原因', trigger: 'change' }
        ],
        Note: [
          {
            validator: (rule, value, callback) => {
              if (value.length >= 200) {
                callback(new Error('备注过长'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      newVisible: false, // 新建修改原因弹窗
      reasonDialog: false, // 新建修改原因弹窗
      reasonsList: [], // 原因下拉
      goodDetailVisible: false,
      goodsId: null
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.printId = Number(query.id)
      if (!this.printId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET({
        PrintId: this.printId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.editForm = Object.assign({}, res.data.Data)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS({
        PrintId: this.printId,
        PageIndex: this.pg,
        PageSize: this.size,
        OrderBy: 0,
        IsAsced: YNStatus.No,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    handleCommand(command) {
      this.ladingBill = {
        billType: command,
        visible: true
      }
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.checkParams = {
        type: false,
        id: goodsId
      }
      this.checkDialog = true
    },
    delGood(id, index) {
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_GOODS_PRINT_ORDER_ITEM_DELETE({
            ItemId: id,
            PrintId: index
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              if (this.goodsData.length === 1) {
                this.pg = 1
              }
              this.getGoods()
              this.getDetail()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    priceSort(sort) {
      switch (sort.prop) {
        case 'PriceCode':
          this.priceOrderForm.OrderBy = 0
          break
        case 'CreateTime':
          this.priceOrderForm.OrderBy = 1
          break
        case 'CheckTime':
          this.priceOrderForm.OrderBy = 3
          break
        default:
          this.priceOrderForm.OrderBy = 0
          break
      }
      this.priceOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getPriceData()
    },
    modifySort(sort) {
      switch (sort.prop) {
        case 'ModifyCode':
          this.modifyOrderForm.OrderBy = 0
          break
        case 'CreateTime':
          this.modifyOrderForm.OrderBy = 1
          break
        case 'CheckTime':
          this.modifyOrderForm.OrderBy = 3
          break
        default:
          this.modifyOrderForm.OrderBy = 0
          break
      }
      this.modifyOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getModifyData()
    },
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        let result = []
        codes.forEach(c => {
          result.push(c.StoreBarCode)
        })
        this.addGoods(result)
      } else {
        this.multiCodeVisible = false
      }
    },
    codeEnter() {
      this.addGoods([this.code])
    },
    addGoods(items) {
      STOCKING_API_GOODS_PRINT_ORDER_ITEM_CREATE({
        PrintId: this.printId,
        BarCodes: items
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.getDetail()
          this.getGoods()
          this.code = ''
          this.multiCodeVisible = false
        } else {
          this.$confirm(res.data.Message, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
        this.code = ''
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    listenEditDialog(form, flag) {
      if (flag) {
        this.detail = Object.assign(this.detail, form)
      } else {
        this.editForm = Object.assign({}, this.detail)
      }
      this.editDialog = false
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    checkGold(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    },
    // 打开选择货品弹窗
    selectGoods() {
      if (!this.printId) {
        return false
      }
      this.selectGoodsVisible = true
      this.onSearch()
    },
    onSearch() {
      this.selectForm.PageIndex = 1
      this.getData()
    },
    // 获取选择货品数据
    getData() {
      // if (
      //   this.$store.getters.user_session.CharacterType === CharacterType.Company
      // ) {
      STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSFORGOODS(this.selectForm).then(
        res => {
          if (res.data.Code == 'CORRECT') {
            this.selectData = res.data.Data.Rows
            this.selecTotal = res.data.Data.Count
          }
        }
      )
      // }
      // if (
      //   this.$store.getters.user_session.CharacterType === CharacterType.Store
      // ) {
      //   STOCKING_API_GOODS_STOCK_DESK_REQS(this.selectForm).then(res => {
      //     if (res.data.Code == 'CORRECT') {
      //       this.selectData = res.data.Data.Rows
      //       this.selecTotal = res.data.Data.Count
      //     }
      //   })
      // }
    },
    // 选中货品
    selectGoodsCurrChange(val) {
      this.currentRow = val
    },
    // 关闭选择货品
    selectGoodsColse() {
      this.$refs['selectGoods'].resetFields()
      this.selectGoodsVisible = false
      this.currentRow = []
    },
    // 确定添加货品
    confirmSelectGoods(close) {
      if (this.currentRow.length) {
        const item = this.currentRow.map(item => {
          return item.BarCode
        })
        const para = {
          PrintId: this.printId,
          BarCodes: item
        }
        STOCKING_API_GOODS_PRINT_ORDER_ITEM_CREATE(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('添加成功')
            this.getDetail()
            this.getGoods()
            if (close) {
              this.selectGoodsColse()
            }
          }
        })
      } else {
        this.$message.error('请选择货品')
      }
    },
    selectPageChange(val) {
      // 切换当前页
      this.selectForm.PageIndex = val
      this.getData()
    },
    selectPageSizeChange(val) {
      // 切换每页显示条数
      this.selectForm.PageSize = val
      this.selectForm.PageIndex = 1
      this.getData()
    },
    resisePageChange(val) {
      // 采购入库切换当前页
      this.raiseForm.PageIndex = val
      this.getReiseData()
    },
    resisePageSizeChange(val) {
      // 采购入库切换每页显示条数
      this.raiseForm.PageSize = val
      this.raiseForm.PageIndex = 1
      this.getReiseData()
    },
    openReiseDialog(command) {
      if (command == 'purchaseList') {
        this.reiseVisible = true
        this.getReiseData()
      }
      if (command == 'pricingList') {
        this.priceVisible = true
        this.getPriceData()
      }
      if (command == 'modifyList') {
        this.modifyVisible = true
        this.getModifyData()
      }
    },
    handleCurrentChange(val) {
      this.raiseOrderRow = val
    },
    // 获取成品采购单数据
    getReiseData() {
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS(this.raiseForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.raiseData = res.data.Data.Rows
          this.raiseTotal = res.data.Data.Count
        }
      })
    },
    // 成品采购成功
    confirmReise() {
      if (this.raiseOrderRow) {
        const para = {
          PrintId: this.printId,
          OrderId: this.raiseOrderRow.IntakeId
        }
        STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTINTAKECREATE(para).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('创建成功')
              this.getDetail()
              this.getGoods()
              this.colseReise()
            }
          }
        )
      } else {
        this.$message.error('请选择成品采购单')
      }
    },
    colseReise() {
      this.raiseForm = {
        PartnerName: '',
        IntakeCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        State: 0,
        PageIndex: 1,
        PageSize: 20
      },
      this.$refs['selectReise'].resetFields()
      this.reiseVisible = false
      this.raiseOrderRow = null
    },
    getPriceData() {
      STOCKING_API_GOODS_PRICE_ORDER_BASIC_GETS(this.priceOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.priceData = res.data.Data.Rows
            this.priceTotal = res.data.Data.Count
          }
        }
      )
    },
    // getModifyData ()STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS
    // 成品调货单确认
    confirmPrice() {
      if (this.priceOrderRow) {
        const para = {
          PrintId: this.printId,
          OrderId: this.priceOrderRow.PriceId
        }
        STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTPRICECREATE(para).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('创建成功')
              this.getDetail()
              this.getGoods()
              this.colsePrice()
            }
          }
        )
      } else {
        this.$message.error('请选择成品调货单')
      }
    },
    colsePrice() {
      this.priceOrderForm = {
        PriceCode: '',
        CreateUserId: 0,
        ReasonTypeDk: 0,
        OrderBy: 0,
        State: GoodsPriceOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.$refs['selectPriceOrder'].resetFields()
      this.priceVisible = false
      this.priceOrderRow = null
    },
    priceCurrentChange(val) {
      this.priceOrderRow = val
    },
    pricePageChange(val) {
      // 成品调价单切换当前页
      this.priceOrderForm.PageIndex = val
      this.getPriceData()
    },
    pricePageSizeChange(val) {
      // 成品调价单切换每页显示条数
      this.priceOrderForm.PageSize = val
      this.priceOrderForm.PageIndex = 1
      this.getPriceData()
    },
    getModifyData() {
      STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS(this.modifyOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.modifyData = res.data.Data.Rows
            this.modifyTotal = res.data.Data.Count
          }
        }
      )
    },
    // 成品修改单确认
    confirmModify() {
      if (this.modifyOrderRow) {
        const para = {
          PrintId: this.printId,
          OrderId: this.modifyOrderRow.ModifyId
        }
        STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTMODIFYCREATE(para).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.getDetail()
              this.getGoods()
              this.colseModify()
            }
          }
        )
      } else {
        this.$message.error('请选择成品修改单')
      }
    },
    colseModify() {
      this.modifyOrderForm = {
        PriceCode: '',
        CreateUserId: 0,
        ReasonTypeDk: 0,
        OrderBy: 0,
        State: GoodsPriceOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.$refs['selectModifyOrder'].resetFields()
      this.modifyVisible = false
      this.modifyOrderRow = null
    },
    modifyCurrentChange(val) {
      this.modifyOrderRow = val
    },
    modifyPageChange(val) {
      // 成品修改单切换当前页
      this.modifyOrderForm.PageIndex = val
      this.getModifyData()
    },
    modifyPageSizeChange(val) {
      // 成品修改单切换每页显示条数
      this.modifyOrderForm.PageSize = val
      this.modifyOrderForm.PageIndex = 1
      this.getModifyData()
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    // 获取成品调价原因
    getReturn() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        State: EnableState.Enable,
        DictType: SettingDictionaryDictType.GoodsPriceOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.priceOrderList = res.data.Data.Rows
        }
      })
    },
    // 获取修改原因
    getEditReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        State: EnableState.Enable,
        DictType: SettingDictionaryDictType.GoodsPrintOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasonsList = res.data.Data.Rows
        }
      })
    },
    // 获取修改单原因
    getModifyList() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        State: EnableState.Enable,
        DictType: SettingDictionaryDictType.GoodsModifyOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.modifyOrderList = res.data.Data.Rows
        }
      })
    },
    getCreateUserList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.usersList = res.data.Data.Rows
        }
      })
    },
    // 打开新建弹窗
    newEndProduct() {
      this.newVisible = true
    },
    // 修改弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this.reasonsList.find(item => {
            return item.Id == this.editForm.ReasonTypeDk
          })
          const para = {
            ...this.editForm,
            ReasonTypeDk: Number(this.editForm.ReasonTypeDk),
            ReasonTypeDv: obj.Value
          }
          STOCKING_API_GOODS_PRINT_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message.success('创建成功')
              this.newVisible = false
              this.getDetail()
            }
          })
        }
      })
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.newVisible = false
    },
    // 打印原因
    reasonTypeChange() {
      this.reasonsList.map(item => {
        if (item.Id == this.newPurchaseOrder.ReasonTypeDk) {
          this.newPurchaseOrder.ReasonTypeDv = item.Value
        }
      })
    }
  },
  mounted() {
    this.getSupplierList()
    this.getCreateUserList()
    this.getReturn()
    this.getEditReason()
    this.getModifyList()
    this.init()
  },
  components: {
    pagination,
    goodDetails,
    SelectGoods,
    MultiCodeEnter,
    goldCheck,
    dictManage,
    dialogGoodDetail
  }
}
</script>
<style lang="scss" scoped>
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
.panel-tag {
  position: relative;
  .el-back {
    position: absolute;
    right: 25px;
    z-index: 10;
  }
}
.search-box {
  padding: 0;
  border: none;
}

.el-dialog__body .item-lh-26 .m-b-20 {
  margin-bottom: 16px !important;
}
</style>

