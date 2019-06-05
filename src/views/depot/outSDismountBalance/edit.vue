<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑委外拆卸结算单</span>
        <span @click="editDialog=true" class="title text-btn fr">修改</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SettleCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === weiwStuffSettleBasicState.Audit || detail.State === weiwStuffSettleBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">结算类型</td>
                <td>{{weiwGjunkSettleBasicSourceType.Types[detail.SourceType]}}</td>
                <td class="tit">相关单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">应付款</td>
                <td>￥{{detail.Preprice}}</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">备注</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <ul class="tabs m-b-1">
            <li class="tab" v-if="detail.SourceType == weiwGjunkSettleBasicSourceType.Goods" 
            :class="{active: currTabs == 0}" @click="changeTabs(0)">投入成品</li>
            <li class="tab" v-else :class="{active: currTabs == 1}" @click="changeTabs(1)">投入旧货</li>
            <li class="tab" :class="{active: currTabs == 2}" @click="changeTabs(2)">产出金料</li>
            <li class="tab" :class="{active: currTabs == 3}" @click="changeTabs(3)">产出石料</li>
            <li class="tab" :class="{active: currTabs == 4}" @click="changeTabs(4)">产出配件</li>
            <li class="tab" :class="{active: currTabs == 5}" @click="changeTabs(5)">工费</li>
          </ul>
          <el-table 
            v-scrollshow="handelScrollshow"
            class="fixed-tr edit-table" 
            :data="data" 
            ref="halfTable" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text="拼命加载中" 
            :row-class-name="setEditRow"
            highlight-current-row
            height="600">
            <el-table-column type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="01" prop="BarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="02" prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="03" prop="Weight" label="货重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{scope.row.Weight}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="04" prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{scope.row.GoldWeight}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="05" prop="Stone1Weight" label="主石重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{scope.row.Stone1Weight}}ct
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="06" prop="Stone1Qty" label="主石数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="07" prop="Price" label="成本价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                ￥{{scope.row.Price}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="08" prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>

            <el-table-column v-if="currTabs == 1" key="10" prop="JunkCode" label="旧货编码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="11" prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="12" prop="IsGold" label="类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes?'素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="13" prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{scope.row.GoldWeight}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="15" prop="StoneWeight" label="主石重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{scope.row.StoneWeight}}ct
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="16" prop="StoneColor" label="主石颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{StoneColor.Types[scope.row.StoneColor]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="17" prop="StoneClarity" label="主石净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{StoneClarity.Types[scope.row.StoneClarity]}}
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == 2" key="20" prop="GoldType" min-width="80" show-overflow-tooltip>
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>成色</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.GoldType" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.goldType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="30" prop="StoneClassTypeEk" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石类</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneClassTypeEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.stone.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="31" prop="StonePackageNo" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石号/包号</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePackageNo" @blur="scope.row.StonePackageNo = scope.row.StonePackageNo.trim()" :maxlength="30" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="32" prop="StoneWeightEk" label="石重范围" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneWeightEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.stoneWeight.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="33" prop="StoneColor" label="颜色" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneColor" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in StoneColor.TypeArray" :key="item.Id" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="34" prop="StoneClarity" label="净度" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneClarity" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in StoneClarity.TypeArray" :key="item.Id" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="35" prop="StoneCut" label="切工" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <!-- <el-input v-model="scope.row.StoneCut" :maxlength="20" @change="handleFocus(scope.row)"></el-input> -->
                <el-select v-model="scope.row.StoneCut" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="(item, index) in StoneCut.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="36" prop="StoneSpec" label="规格" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StoneSpec" :maxlength="20" @input="handleFocus(scope.row)" ></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 4" key="40" prop="PartTypeEk" min-width="130">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>配件名称</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.PartTypeEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.part.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Weight" :label="currTabs == 3?'重量(ct)':'重量(g)'" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Weight" :maxlength="10" @keyup.native="scope.row.Weight=$root.toFixed(scope.row.Weight,3)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Quantity" label="数量" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Quantity" :maxlength="8" @keyup.native="scope.row.Quantity=$root.toFixed(scope.row.Quantity,0)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == 3" key="38" prop="StonePrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice2" :maxlength="10" @keyup.native="scope.row.StonePrice2=$root.toFixed(scope.row.StonePrice2,2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="37" prop="StonePrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice1" :maxlength="10" @keyup.native="scope.row.StonePrice1=$root.toFixed(scope.row.StonePrice1,2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 4" key="42" prop="PartPrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice2" :maxlength="10" @keyup.native="scope.row.PartPrice2=$root.toFixed(scope.row.PartPrice2,2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 4" key="41" prop="PartPrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice1" :maxlength="10" @keyup.native="scope.row.PartPrice1=$root.toFixed(scope.row.PartPrice1,2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2" key="21" prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.GoldPrice" :maxlength="10" @keyup.native="scope.row.GoldPrice=$root.toFixed(scope.row.GoldPrice,2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Price" label="金额" min-width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Price" :maxlength="10" @keyup.native="scope.row.Price=$root.toFixed(scope.row.Price,2)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == 5" key="50" prop="CraftType" min-width="80" show-overflow-tooltip>
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>工费类型</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.CraftType" @blur="scope.row.CraftType = scope.row.CraftType.trim()" :maxlength="50" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 5" key="51" prop="Price" label="金额" min-width="80">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Price" :maxlength="10" @keyup.native="scope.row.Price=$root.toFixed(scope.row.Price,2)" @input="handleFocus(scope.row)" name="Price"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 5" key="52" prop="Note" label="备注" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Note" :maxlength="200" @input="handleFocus(scope.row)" name="Note"></el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs != 0&&currTabs != 1" label="操作" width="100" fixed>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <div class="handle-btn">
                  <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
                  <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow($event, scope)" style="color: #d74040" title="删除此行"></i>
                  <i name="copyShow" class="icon-copy1 handel-icon" @click="copyShow(scope)" style="color: #7798af" title="复制此行"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- 分页 end -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit">{{ enableSubmit ? '提交审核': '保存'}}</el-button>
      <template>
        <el-button @click="$router.back(-1)">返回</el-button>
      </template>
      <span class="fr">注：审核后从供应商库存增加产出的金料、石料、配件</span>
    </div>

    <!-- @module Dialog·编辑委外加工结算 -->
    <el-dialog title="编辑委外加工结算" :visible.sync="editDialog" @close="resetEditForm" width="500px">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="供应商：" prop="PartnerId" required>
          <el-select v-model="editForm.PartnerId" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return((item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes)})" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型：" prop="SourceType" required>
          <el-select v-model="editForm.SourceType" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in weiwGjunkSettleBasicSourceType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关单号：" prop="PreviousCode" required>
          <el-input v-model="editForm.PreviousCode" @blur="editForm.PreviousCode = editForm.PreviousCode.trim()" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input v-model="editForm.Preprice" :maxlength="10" @keyup.native="editForm.Preprice=$root.toFixed(editForm.Preprice,2)"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="">
          <el-input type="textarea" row="Note" v-model="editForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPurchase" :loading="$store.getters.is_loading">保 存</el-button>
        <el-button @click="editDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·编辑委外加工结算 -->

    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" @keyup.enter.native="addSure" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :min="1" :max="50" :precision="0" :controls="false" style="width: 200px"></el-input-number>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" :loading="$store.getters.is_loading" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->

    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
      <el-form :model="copyLineForm" @keyup.enter.native="copySure" @submit.native.prevent>
        <el-form-item label="行数：">
          <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
          <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :min="1" :max="50" :precision="0" :controls="false" style="width: 200px"></el-input-number>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">复制到第 <el-input-number name="rowsNum" v-model="copyLineForm.current" :min="1" :max="data.length" :controls="false" style="width: 50px"></el-input-number> 行</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" :loading="$store.getters.is_loading" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
  </div>
</template>

<script>
import {
  YNStatus,
  StuffType,
  PartnerType
} from '@/enums/common.js'
import {
  FeeType,
  StoneColor,
  StoneClarity,
  StoneCut,
  WeiwStuffSettleBasicState,
  WeiwGjunkSettleBasicSourceType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GET,
  STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_UPDATE ,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS ,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS ,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CRAFTCREATE ,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CREATE,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_UPDATE,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_DELETE   ,
  STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_WAIT
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'

export default {
  data() {
    return {
      PartnerType,
      FeeType,
      YNStatus,
      StuffType,
      StoneColor,
      StoneClarity,
      StoneCut,
      goodsData: [], // 货品数据
      SettingEnumeratorEnumeratorType,
      weiwGjunkSettleBasicSourceType: WeiwGjunkSettleBasicSourceType,
      weiwStuffSettleBasicState: WeiwStuffSettleBasicState,
      PageSize: 20, // 分页数据条数
      PageIndex: 1, // 当前页面位置
      total: 0, // 总数据条数
      SettleId: '',
      currTabs: 0, // 当前选中的tabs
      enableSubmit: true, // 控制请求一个一个提交
      radio2: 3,
      detail: {},
      CraftTypes: [],
      data: [],
      table0: [],
      table1: [],
      table2: [],
      table3: [],
      table4: [],
      table5: [],
      total0: 0,
      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      options: [],
      value: '',
      goodsId: '', // 选中的货品id
      editForm: {},
      rules: {
        PartnerId: [
          {
            type: 'number',
            required: true,
            message: '请选择供应商',
            trigger: 'change'
          }
        ],
        SourceType: [
          {
            type: 'number',
            required: true,
            message: '请选择来源类型',
            trigger: 'change'
          }
        ],
        PreviousCode: [
          {
            required: true,
            message: '请输入相关单号',
            trigger: 'change'
          }
        ],
        // Preprice: [
        //   {
        //     type: 'number',
        //     message: '请输入应付款',
        //     trigger: 'change'
        //   }
        // ]
      },
      currStuffType: '',
      editDialog: false,
      addDialog: false,
      addVisible: false,
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false,
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      handleRow: {},
      currentRow: 0,
      visible: false,
      isAdd: false,
      isNew: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
    }
  },
  methods: {
    // 设置选中样式
    setEditRow({ row }) {
      if (row.isEdit) {
        return 'edit-row'
      }
      if (row.isError) {
        return 'error-row'
      }
    },
    // 表格懒加载
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    init() {
      let query = this.$route.query
      this.SettleId = Number(query.id)||0
      if (!this.SettleId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    getDetail() {
      STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GET({SettleId: this.SettleId}).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
          this.detail.Preprice = this.$root.toFloat(this.detail.Preprice)
          this.editForm = Object.assign({}, this.detail)
          if(this.detail.SourceType == this.weiwGjunkSettleBasicSourceType.Goods){
            this.currTabs = 0
          }else{
            this.currTabs = 1
          }
          this.getGoods()
        }
      })
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
    getGoods() {
      let obj = {}
      let apiMethod = ''
      this.$store.commit('SET_TB_LOADING', true)
      switch(this.currTabs){
        case 0:
          obj = {
            SplitId: this.detail.PreviousId,
            OrderBy: 0,
            IsAsced: this.YNStatus.No,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }
          apiMethod = STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS 
          break
        case 1:
          obj = {
            SplitId: this.detail.PreviousId,
            OrderBy: 0,
            IsAsced: this.YNStatus.No,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }
          apiMethod = STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK
          break
        case 2:
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Gold
          obj.PageIndex = this.PageIndex,
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Gold
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        case 3:
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Stone
          obj.PageIndex = this.PageIndex,
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Stone
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        case 4:
          obj = {}
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Part
          obj.PageIndex = this.PageIndex,
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Part
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        default:
          break
      }
      if(this.currTabs != 5){
        apiMethod(obj).then(res => {
          this.$store.commit('SET_TB_LOADING', false)
          if(res.data.Code == 'CORRECT'){
            this.data = res.data.Data.Rows||[]
            if(this.currTabs == 0){
              this.table0 = res.data.Data.Rows||[]
              this.total0 = res.data.Data.Count||0
            }else if(this.currTabs == 1){
              this.table1 = res.data.Data.Rows||[]
              this.total1 = res.data.Data.Count||0
            }else if(this.currTabs == 2){
              this.table2 = res.data.Data.Rows||[]
              this.total2 = res.data.Data.Count||0
            }else if(this.currTabs == 3){
              this.table3 = res.data.Data.Rows||[]
              this.total3 = res.data.Data.Count||0
            }else if(this.currTabs == 4){
              this.table4 = res.data.Data.Rows||[]
              this.total4 = res.data.Data.Count||0
            }
            this.data.forEach(item => {
              item.GoldWeight = this.$root.toFloat(item.GoldWeight, 3)
              item.Stone1Weight = this.$root.toFloat(item.Stone1Weight,3)
              item.StoneWeight = this.$root.toFloat(item.StoneWeight,3)
              item.CostPrice = this.$root.toFloat(item.CostPrice)
              item.GoldPrice = this.$root.toFloat(item.GoldPrice)
              item.StonePrice1 = this.$root.toFloat(item.StonePrice1)
              item.StonePrice2 = this.$root.toFloat(item.StonePrice2)
              item.PartPrice1 = this.$root.toFloat(item.PartPrice1)
              item.PartPrice2 = this.$root.toFloat(item.PartPrice2)
              item.Weight = this.$root.toFloat(item.Weight,3)
              item.Price = this.$root.toFloat(item.Price)
            })
            this.total = this[`total${this.currTabs}`]
            if(this.data.length == 0&&(this.currTabs == 2||this.currTabs == 3||this.currTabs == 4)){
              for (let i=0; i<10; i++) {
                this.data.push({
                  SettleId: this.SettleId,
                  StuffType: this.currStuffType,
                  GoldType: 0,
                  GoldPrice: '',
                  PartTypeEk: 0,
                  PartTypeEv: '',
                  PartPrice1: '',
                  PartPrice2: '',
                  StonePackageNo: '',
                  StoneClassTypeEk: 0,
                  StoneClassTypeEv: '',
                  StoneWeightEk: 0,
                  StoneWeightEv: '',
                  StoneSpec: '',
                  StoneColor: 0,
                  StoneClarity: 0,
                  StoneCut: 0,
                  StonePrice1: '',
                  StonePrice2: '',
                  Quantity: '',
                  Weight: '',
                  Price: '',
                  Note: '',
                  Stamp:'',
                  State: 0,
                  isEdit: false,
                  isError: false,
                })
              }
            }
          }
        })
      }else{
        this.$store.commit('SET_TB_LOADING', false)
        if(this.detail.CraftNote&&this.detail.CraftNote!='null'&&JSON.parse(this.detail.CraftNote).length>0){
          this.data = JSON.parse(this.detail.CraftNote)
          this.data.forEach(item => {
            item.Price = this.$root.toFloat(item.Price)
          })
        }else{
          for(let i=0; i<10; i++){
            this.data.push({
              CraftId: i+1,
              CraftType: '',
              Price: '',
              Note: '',
              isEdit: false,
              isError: false,
            })
          }
        }
      }
    },
    changeTabs(index){
      this.total = 0
      this.PageIndex = 1
      this.PageSize = 20
      this[`table${this.currTabs}`] = JSON.parse(JSON.stringify(this.data))
      this.data = []
      this.currTabs = index
      this.enableSubmit = true
      if(this[`table${index}`].length == 0){ // 有数据就不请求
        this.getGoods()
      }else{
        this.data = JSON.parse(JSON.stringify(this[`table${index}`]))
        if(this.currTabs != 5){
          this.total = JSON.parse(JSON.stringify(this[`total${index}`]))
        }
      }
    },
    editPurchase(){
      STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_UPDATE ({
        SettleId: this.SettleId,
        SourceType: this.editForm.SourceType,
        PreviousCode: this.editForm.PreviousCode,
        PartnerId: this.editForm.PartnerId,
        Preprice: this.$root.toInt(this.editForm.Preprice),
        Note: this.editForm.Note
      }).then(res => {
        if(res.data.Code == 'CORRECT') {
          this.$message.success('提交成功！')
          this.getDetail()
          this.editDialog = false
        }
      })
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
      this.addLineForm = {
        rowsNum: 1,
        local: '1'
      }
    },
    addSure() {
      // 确定插入空白行
      if (parseFloat(this.addLineForm.rowsNum) > 50) {
        this.$message.warning('最多新增50行')
        return false
      }
      let local
      local = this.addLineForm.local == 1 ? 1 : 0
      if(this.currTabs != 5){
        for (let i = 0; i < this.addLineForm.rowsNum; i++) {
          this.data.splice(this.handleRow.$index + local, 0, {
            SettleId: this.SettleId,
            StuffType: this.currStuffType,
            GoldType: 0,
            GoldPrice: '',
            PartTypeEk: 0,
            PartTypeEv: '',
            PartPrice1: '',
            PartPrice2: '',
            StonePackageNo: '',
            StoneClassTypeEk: 0,
            StoneClassTypeEv: '',
            StoneWeightEk: 0,
            StoneWeightEv: '',
            StoneSpec: '',
            StoneColor: 0,
            StoneClarity: 0,
            StoneCut: 0,
            StonePrice1: '',
            StonePrice2: '',
            Quantity: '',
            Weight: '',
            Price: '',
            Note: '',
            Stamp:'',
            State: 0,
            isEdit: false,
            isError: false,
          })
        }
      }else{ // 工费
        for (let i = 0; i < this.addLineForm.rowsNum; i++) {
          this.data.splice(this.handleRow.$index + local, 0, {
            CraftId: this.handleRow.$index + 1,
            CraftType: '',
            Price: '',
            Note: '', 
            isEdit: false,
            isError: false,
          })
        }
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (this.data.length <= 1 && !scope.row.ItemId && this.PageIndex === 1) {
        this.$message.warning('至少保留一行')
        return false
      }
      $event.currentTarget.blur()
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!scope.row.ItemId||(this.currTabs == 5&&!scope.row.CraftType)) { // 删除空白行
          this.data.splice(scope.$index, 1)
          if(this.data.length == 0&&this.currTabs != 5){
            this.PageIndex = 1
            this.getGoods()
            this.enableSubmit = true
          }
        } else { // 删除有数据的行
          if(this.currTabs != 5){
            STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_DELETE   ({
              ItemId: scope.row.ItemId,
              SettleId: this.SettleId,
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                // this.getGoods()
                this.total=Math.max(0,this.total-1)
                this.data.splice(scope.$index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if(this.data.length == 0){
                  // this.data.splice(scope.$index, 1)
                  if (this.PageIndex > 1) {
                    this.PageIndex = 1
                    this.init()
                  }else{
                    this.data.push({
                      SettleId: this.SettleId,
                      StuffType: this.currStuffType,
                      GoldType: 0,
                      GoldPrice: '',
                      PartTypeEk: 0,
                      PartTypeEv: '',
                      PartPrice1: '',
                      PartPrice2: '',
                      StonePackageNo: '',
                      StoneClassTypeEk: 0,
                      StoneClassTypeEv: '',
                      StoneWeightEk: 0,
                      StoneWeightEv: '',
                      StoneSpec: '',
                      StoneColor: 0,
                      StoneClarity: 0,
                      StoneCut: 0,
                      StonePrice1: '',
                      StonePrice2: '',
                      Quantity: '',
                      Weight: '',
                      Price: '',
                      Note: '',
                      Stamp:'',
                      State: 0,
                      isEdit: false,
                      isError: false,
                    })
                  }
                }
              }
            })
          }else{
            this.data.splice(scope.$index, 1)
            let craftData = JSON.parse(JSON.stringify(this.data))
            let items = craftData.filter(item => {
              return item.CraftType != ''
            })
            items.forEach(item => {
              item.Price = this.$root.toInt(item.Price)
            })
            STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CRAFTCREATE ({
              SettleId: this.SettleId,
              items: items
            }).then(res => {
              if(res.data.Code == 'CORRECT'){
                this.$message.success('提交成功！')
              }
            })
            
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info', message: '已取消删除' 
        })
      })
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
      this.copyLineForm = {
        rowsNum: 1,
        local: '1',
        current: 1
      }
    },
    copySure() {
      // 确定复制
      let local
      if (this.copyLineForm.local == 1) {
        local = this.handleRow.$index + 1
      } else {
        local = this.copyLineForm.current - 1
      }
      for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
        let item = { ...this.handleRow.row }
        item.isEdit = this.handleRow.row.ItemId || this.handleRow.row.isEdit
        if (item.ItemId) {
          item.ItemId = ''
        }
        if (item.isError) {
          item.isEdit = true
          item.isError = false
        }
        this.data.splice(local, 0, item)
      }
      this.enableSubmit = false
      this.copyVisible = false
    },
    resetEditForm(){
      this.editForm = Object.assign({}, this.detail)
    },
    orderSubmit(){
      if(this.enableSubmit){
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_WAIT({
          SettleId: this.SettleId,
          CheckNote: this.detail.Note
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if(res.data.Code == 'CORRECT'){
            this.$message.success('提交成功！')
            this.$router.push({
              path: '/depot/outSDismountBalance/index'
            })
          }
        }).catch(() => {
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }else{
        this.handleCurrentChange()
      }
    },
    pageChange(val){
      this.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val){
      this.PageIndex = 1
      this.PageSize = val
      this.getGoods()
    },
    getPrice(row){
      // 石料和配件中，重单价*重量 的优先级大于 数单价*数量
      let currPrice = 0
      if(this.currTabs == 2){
        currPrice = row.GoldPrice * row.Weight
      }else if(this.currTabs == 3){
        let p1 = row.StonePrice2 * row.Weight
        let p2 = row.StonePrice1 * row.Quantity
        currPrice = p1 ? p1 : p2
      }else if(this.currTabs == 4){
        let p3 = row.PartPrice2 * row.Weight
        let p4 = row.PartPrice1 * row.Quantity
        currPrice = p3 ? p3 : p4
      }
      
      if(currPrice > 999999999){
        this.$message.warning('金额不能超过999999999')
        row.Price = 999999999
      }else{
        row.Price = currPrice.toFixed(2)
      }
    },
    handleFocus(row) {
      row.isEdit = true
      row.isError = false
      this.enableSubmit = false
    },
    async handleCurrentChange(){
      this.$store.commit('SET_BTN_LOADING', true)
      let errorlist = []
      if(this.currTabs != 0&&this.currTabs != 1&&this.currTabs != 5&&!this.enableSubmit){
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].isEdit || this.data[i].isError) {
            if((this.data[i].Quantity == 0 && this.data[i].Weight == 0)||(!this.data[i].Quantity&&!this.data[i].Weight)){
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：重量或数量输入错误<br>`)
              continue
            }
            if (this.currTabs == 2) {
              if(!this.data[i].GoldType){
                // return this.$message.error('请选择成色')
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：请选择成色<br>`)
                continue
              }
            }else if(this.currTabs == 3){
              if(!this.data[i].StoneClassTypeEk){
                // return this.$message.error('请选择石类')
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：请选择石类<br>`)
                continue
              }
              if(!this.data[i].StonePackageNo){
                // return this.$message.error('请选择石号/包号')
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：请选择石号/包号<br>`)
                continue
              }
              // 石类
              if(this.$store.getters.stone&&this.data[i].StoneClassTypeEk){
                this.data[i].StoneClassTypeEv = this.$store.getters.stone.TypeArray.find(item => {
                  return item.Id == this.data[i].StoneClassTypeEk
                }).Value
              }
              // 石重范围
              if(this.$store.getters.stoneWeight && this.data[i].StoneWeightEk){
                this.data[i].StoneWeightEv = this.$store.getters.stoneWeight.TypeArray.find(item => {
                  return item.Id == this.data[i].StoneWeightEk
                }).Value
              }
            }else if(this.currTabs == 4){
              if(!this.data[i].PartTypeEk){
                // return this.$message.error('请选择配件名称')
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：请选择配件名称<br>`)
                continue
              }
              // 配件名称
              if(this.$store.getters.part&&this.data[i].PartTypeEk){
                this.data[i].PartTypeEv = this.$store.getters.part.TypeArray.find(item => {
                  return item.Id == this.data[i].PartTypeEk
                }).Value
              }
            }
            if(this.data[i].isEdit || this.data[i].isError){
              let res
              let obj = {...this.data[i]}
              obj.Weight = this.$root.toInt(obj.Weight)
              obj.GoldWeight = this.$root.toInt(obj.GoldWeight, 3)
              obj.Stone1Weight = this.$root.toInt(obj.Stone1Weight)
              obj.StoneWeight = this.$root.toInt(obj.StoneWeight)
              obj.CostPrice = this.$root.toInt(obj.CostPrice)
              obj.GoldPrice = this.$root.toInt(obj.GoldPrice)
              obj.StonePrice1 = this.$root.toInt(obj.StonePrice1)
              obj.StonePrice2 = this.$root.toInt(obj.StonePrice2)
              obj.PartPrice1 = this.$root.toInt(obj.PartPrice1)
              obj.PartPrice2 = this.$root.toInt(obj.PartPrice2)
              obj.Quantity = Number(obj.Quantity)||0
              obj.Price = this.$root.toInt(obj.Price)
              if (this.data[i].ItemId) {
                res = await STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_UPDATE(obj)
              } else {
                res = await STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CREATE(obj)
              }

              this.$store.commit('SET_BTN_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.data[i].isEdit = false
                if (!this.data[i].ItemId) {
                  this.total=Math.max(0,this.total+1)
                  this.$set(this.data[i], 'ItemId', res.data.Data)
                }
              } else {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
              }
            }
          }
        }
      }else if(this.currTabs == 5){
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].isEdit || this.data[i].isError) {
            if (!this.data[i].CraftType) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：工费类型不能为空<br>`)
            }
          }
        }
        let craftData = JSON.parse(JSON.stringify(this.data))
        let items = craftData.filter(item => {
          return item.CraftType != ''
        })
        items.forEach(item => {
          item.Price = this.$root.toInt(item.Price)
        })
        if(items&&items.length>0){
          STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CRAFTCREATE ({
            SettleId: this.SettleId,
            items: items
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if(res.data.Code == 'CORRECT'){
              this.enableSubmit = true
              this.$message.success('提交成功！')
            }
          })
        }
      }
      if (errorlist.length) {
        this.$alert(errorlist.join(''), '错误提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        this.$message.success('保存成功')
        this.enableSubmit = true
        // this.getDetail()
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_CATEGORY_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_GOLD_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_STONE_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_PART_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_STONEWEIGHT', this.YNStatus.Yes) 
    },
  },
  beforeMount(){
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
.fixed-tr .el-form-item{
  margin-bottom: 0px;
}
.fixed-tr .el-form-item--mini{
  margin-bottom: 0px;
}
</style>

<style lang="scss" scoped>
.import-purchase-dialog {
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}

.goods-wrapper .goods-left .toolsbar {
  height: 98px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.m-b-1{
  margin-bottom: 1px;
}
.edit-btn{
  color: #399fe5!important;
  cursor: pointer;
}
</style>
