<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">编辑进货入库单({{StuffType.Types[detail.StuffType]}})</span>
        <el-button name="btnBack" @click="showEdit" class="el-back" type="text">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.IntakeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核</td>
                <td
                  v-if="detail.State === StuffIntakeOrderBasicState.Audit || detail.State === StuffIntakeOrderBasicState.Reject"
                >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">进货方式</td>
                <td>{{PurchaseType.Types[detail.PurchaseType]}}</td>
                <td class="tit">订货单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
              </tr>
              <tr>
                <td class="tit">采购员</td>
                <td>{{detail.ChargeUser}}</td>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">入库位置</td>
                <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
              </tr>
              <tr>
                <td class="tit">应付款</td>
                <td>￥{{detail.Preprice}}</td>
                <td class="tit">备注</td>
                <td>{{detail.Note}}</td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="checkPage-hd">
          <el-button
            type="primary"
            @click="templateVisible = true"
            name="btnImportant">
            按模板导入
          </el-button>
          <el-button
            type="primary"
            @click="smartVisible = true"
            name="btnSmartImport">
          智能导入
          </el-button>
        </div>-->
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            element-loading-text="拼命加载中"
            ref="goldTable"
            :row-class-name="setEditRow"
            highlight-current-row
            v-if="detail.StuffType === StuffType.Gold"
            height="600"
            v-scrollshow="handelScrollshow"
          >
            <el-table-column label="操作" width="100" fixed>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <div class="handle-btn">
                  <i
                    name="addShow"
                    class="icon-add1 handel-icon"
                    @click="addShow(scope)"
                    style="color: #1f91df"
                    title="新增一行"
                  ></i>
                  <i
                    name="deleteShow"
                    class="icon-reduce1 handel-icon"
                    @click="deleteShow($event, scope)"
                    style="color: #d74040"
                    title="删除此行"
                  ></i>
                  <i
                    name="copyShow"
                    class="icon-copy1 handel-icon"
                    @click="copyShow(scope)"
                    style="color: #7798af"
                    title="复制此行"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="GoldType" label="成色" min-width="120">
              <template slot="header">
                <span class="red">*</span>成色
              </template>
              <template slot-scope="scope">
                <el-select
                  filterable
                  name="GoldType"
                  v-model="scope.row.GoldType"
                  @change="handleFocus(scope.row)"
                >
                  <el-option
                    v-for="item in $store.getters.goldType.TypeArray"
                    :key="item.Id"
                    :label="item.Value"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="金重(g)" min-width="70">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="Weight"
                  v-model="scope.row.Weight"
                  @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Weight" :precision="3" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="件数" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="Quantity"
                  v-model="scope.row.Quantity"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="8"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Quantity" :precision="0" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="GoldPrice"
                  v-model="scope.row.GoldPrice"
                  @keyup.native="scope.row.GoldPrice = $root.toFixed(scope.row.GoldPrice, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.GoldPrice" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="CraftFee1" label="工费①计价(元/克)" min-width="120">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="CraftFee1"
                  v-model="scope.row.CraftFee1"
                  @keyup.native="scope.row.CraftFee1 = $root.toFixed(scope.row.CraftFee1, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.CraftFee1" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="CraftFee2" label="工费②计件(元/件)" min-width="120">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="CraftFee2"
                  v-model="scope.row.CraftFee2"
                  @keyup.native="scope.row.CraftFee2 = $root.toFixed(scope.row.CraftFee2, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.CraftFee2" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="OtherFee" label="其他费用" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="OtherFee"
                  v-model="scope.row.OtherFee"
                  @keyup.native="scope.row.OtherFee = $root.toFixed(scope.row.OtherFee, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.OtherFee" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="Price"
                  v-model="scope.row.Price"
                  @keyup.native="scope.row.Price = $root.toFixed(scope.row.Price, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Price" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Note" label="备注" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="Note"
                  v-model="scope.row.Note"
                  @input="handleFocus(scope.row)"
                  :maxlength="200"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            element-loading-text="拼命加载中"
            ref="stoneTable"
            :row-class-name="setEditRow"
            highlight-current-row
            v-if="detail.StuffType === StuffType.Stone"
            height="600"
            v-scrollshow="handelScrollshow"
          >
            <el-table-column label="操作" width="100" fixed>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <div class="handle-btn">
                  <i
                    name="addShow"
                    class="icon-add1 handel-icon"
                    @click="addShow(scope)"
                    style="color: #1f91df"
                    title="新增一行"
                  ></i>
                  <i
                    name="deleteShow"
                    class="icon-reduce1 handel-icon"
                    @click="deleteShow($event, scope)"
                    style="color: #d74040"
                    title="删除此行"
                  ></i>
                  <i
                    name="copyShow"
                    class="icon-copy1 handel-icon"
                    @click="copyShow(scope)"
                    style="color: #7798af"
                    title="复制此行"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="StoneClassTypeEk" label="石类" min-width="120">
              <template slot="header">
                <span class="red">*</span>石类
              </template>
              <template slot-scope="scope">
                <el-select
                  filterable
                  name="StoneClassTypeEk"
                  v-model="scope.row.StoneClassTypeEk"
                  @change="handleFocus(scope.row)"
                >
                  <el-option
                    v-for="item in $store.getters.stone.TypeArray"
                    :key="item.Id"
                    :label="item.Value"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="StonePackageNo" label="石号/包号" min-width="100">
              <template slot="header">
                <span class="red">*</span>石号/包号
              </template>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="StonePackageNo"
                  v-model="scope.row.StonePackageNo"
                  @change="handleFocus(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="StoneWeightEk" label="石重范围(ct)" min-width="120">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-select
                  filterable
                  name="StoneWeightEk"
                  v-model="scope.row.StoneWeightEk"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneWeight"
                    :key="item.Id"
                    :label="item.Value"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="StoneColor" label="颜色" min-width="120">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-select
                  filterable
                  name="StoneColor"
                  v-model="scope.row.StoneColor"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneColor.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="StoneClarity" label="净度" min-width="120">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-select
                  filterable
                  name="StoneClarity"
                  v-model="scope.row.StoneClarity"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneClarity.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="StoneCut" label="切工" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-select
                  filterable
                  name="StoneCut"
                  v-model="scope.row.StoneCut"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneCut.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="StoneSpec" label="规格" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input
                  name="StoneSpec"
                  v-model="scope.row.StoneSpec"
                  @input="handleFocus(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Quantity" :precision="0" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Quantity"
                  v-model="scope.row.Quantity"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="8"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="重量(ct)" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Weight" :precision="3" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Weight"
                  v-model="scope.row.Weight"
                  @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="StonePrice1" label="数单价" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.StonePrice1" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="StonePrice1"
                  v-model="scope.row.StonePrice1"
                  @keyup.native="scope.row.StonePrice1 = $root.toFixed(scope.row.StonePrice1, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="StonePrice2" label="重单价" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.StonePrice2" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="StonePrice2"
                  v-model="scope.row.StonePrice2"
                  @keyup.native="scope.row.StonePrice2 = $root.toFixed(scope.row.StonePrice2, 2)"
                  @input="handleFocus(scope.row)"
                  @blur="handleBlur(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Price" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Price"
                  v-model="scope.row.Price"
                  @keyup.native="scope.row.Price = $root.toFixed(scope.row.Price, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            element-loading-text="拼命加载中"
            ref="partTable"
            v-if="detail.StuffType === StuffType.Part"
            :row-class-name="setEditRow"
            highlight-current-row
            height="600"
            v-scrollshow="handelScrollshow"
          >
            <el-table-column label="操作" width="100" fixed>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <div class="handle-btn">
                  <i
                    name="addShow"
                    class="icon-add1 handel-icon"
                    @click="addShow(scope)"
                    style="color: #1f91df"
                    title="新增一行"
                  ></i>
                  <i
                    name="deleteShow"
                    class="icon-reduce1 handel-icon"
                    :key="scope.row.ItemId"
                    @click="deleteShow($event, scope)"
                    style="color: #d74040"
                    title="删除此行"
                  ></i>
                  <i
                    name="copyShow"
                    class="icon-copy1 handel-icon"
                    @click="copyShow(scope)"
                    style="color: #7798af"
                    title="复制此行"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="PartTypeEk" label="配件名称" min-width="80">
              <template slot="header">
                <span class="red">*</span>配件名称
              </template>
              <template slot-scope="scope">
                <el-select
                  filterable
                  name="PartTypeEk"
                  v-model="scope.row.PartTypeEk"
                  @change="handleFocus(scope.row)"
                >
                  <el-option
                    v-for="item in PartType"
                    :key="item.Id"
                    :label="item.Value"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Quantity" :precision="0" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Quantity"
                  v-model="scope.row.Quantity"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                  @blur="handleBlur(scope.row)"
                  @input="handleFocus(scope.row)"
                  maxlength="8"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="重量(g)" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Weight" :precision="3" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Weight"
                  v-model="scope.row.Weight"
                  @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                  @blur="handleBlur(scope.row)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="PartPrice1" label="数单价" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.PartPrice1" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="PartPrice1"
                  v-model="scope.row.PartPrice1"
                  @keyup.native="scope.row.PartPrice1 = $root.toFixed(scope.row.PartPrice1, 2)"
                  @blur="handleBlur(scope.row)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="PartPrice2" label="重单价" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.PartPrice2" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="PartPrice2"
                  v-model="scope.row.PartPrice2"
                  @keyup.native="scope.row.PartPrice2 = $root.toFixed(scope.row.PartPrice2, 2)"
                  @blur="handleBlur(scope.row)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Price" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Price"
                  v-model="scope.row.Price"
                  @keyup.native="scope.row.Price = $root.toFixed(scope.row.Price, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :pg="parameters.PageIndex"
            :size="parameters.PageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button
        name="btnSave"
        type="primary"
        @click="save"
        v-if="isSaved"
        :loading="saveLoading"
      >保存</el-button>
      <el-button name="btnSubmit" type="primary" @click="submit" v-else>提交审核</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-row>
    <!-- 编辑 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px">
      <el-form :model="detail" label-width="100px" :rules="editRules" ref="editForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select filterable name="PartnerId" v-model="detail.PartnerId">
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="采购员：" prop="ChargeUserId">
          <el-select
            filterable
            name="ChargeUserId"
            v-model="detail.ChargeUserId"
            @change="chargeUserChange"
          >
            <template v-for="item in $store.getters.users">
              <el-option
                :key="item.UserId"
                v-if="item.UserState === securityUserState.Audit"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="进货方式：" prop="PurchaseType">
          <el-radio-group name="PurchaseType" v-model="detail.PurchaseType">
            <template v-for="item in PurchaseType.TypeArray">
              <el-radio
                :key="item.KeyId"
                :label="parseInt(item.KeyId)"
                v-if="item.KeyId != PurchaseType.WeiwStuff"
              >{{item.Value}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订货单号：" prop="PreviousCode">
          <el-input name="PreviousCode" v-model="detail.PreviousCode" disabled :maxlength="50">
            <el-button
              name="btnSearch"
              slot="append"
              class="el-icon-more iconMores"
              @click="selectOrderForm"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="送货单号：" prop="ExpressCode">
          <el-input name="ExpressCode" v-model="detail.ExpressCode" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="入库位置：" prop="WarehouseId" class="location">
          <el-select filterable name="WarehouseId" v-model="detail.WarehouseId" :disabled="true">
            <template v-for="item in $store.getters.wareHouses">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="ShelfId" class="location shelf">
          <el-select filterable name="ShelfId" v-model="detail.ShelfId" :disabled="true">
            <template v-for="item in shelf">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            name="ActualDate"
            v-model="detail.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input
            name="Preprice"
            v-model="detail.Preprice"
            @keyup.native="detail.Preprice = $root.toFixed(detail.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="detail.Note" maxlength="200"></el-input>200个字以内
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveDetail('editForm')">保存</el-button>
        <el-button name="btnClose" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 编辑 -->
    <!-- @module 导入货品 -->
    <template-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/stuffIntake/'"
    ></template-import>
    <!-- End 导入货品 -->
    <!-- End 智能导入货品 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/stuffIntake/'"
    ></smart-import>
    <!-- @module 智能导入货品 -->
    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px" :before-close="cancelClose">
      <el-form :model="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input
            name="rowsNum"
            v-model="addLineForm.rowsNum"
            @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <!-- <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :controls="false" :min="1" :max="50" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px" :before-close="cancelClose">
      <el-form :model="copyLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input
            name="rowsNum"
            v-model="copyLineForm.rowsNum"
            @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <!-- <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :controls="false" :min="1" :max="10" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">复制到第 <el-input name="rowsNum" v-model="copyLineForm.current" @keyup.native="copyLineForm.current = $root.toFixed(addLineForm.current, 0)" style="width: 50px"></el-input> 行</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
    <el-dialog
      v-if="materialVisible"
      title="选择订货单"
      :visible.sync="materialVisible"
      width="1000px"
      :before-close="materialClose"
    >
      <el-form
        :model="materialForm"
        label-width="100px"
        :inline="true"
        class="item-lh-26"
        ref="materialForm"
      >
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select
            filterable
            name="PartnerId"
            v-model="materialForm.PartnerId"
            placeholder="请选择"
            @change="selectOrderForm"
          >
            <el-option label="所有供应商" :value="0"></el-option>
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="(item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="来源单号：" prop="PreviousCode">
          <el-input
            name="PreviousCode"
            v-model="materialForm.PurchaseCode"
            maxlength="30"
            @keyup.enter.native="selectOrderForm"
          >
            <el-button
              name="btnSearch"
              slot="append"
              class="el-icon-search"
              @click="selectOrderForm"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="materialData"
        @sort-change="materialSort"
        highlight-current-row
        @current-change="qualityCheckChange"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="PurchaseCode"
          fixed
          label="单据编号"
          min-width="140"
          show-overflow-tooltip
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{StuffType.Types[scope.row.StuffType]}}</template>
        </el-table-column>
        <el-table-column
          prop="ActualDate"
          label="业务日期"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
          prop="CreateTime"
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="采购员" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemWgt" label="重量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="应付款" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
        <el-table-column
          label="预计到货日期"
          prop="ForwdDate"
          min-width="120"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.ForwdDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          label="最后操作时间"
          prop="CheckTime"
          min-width="120"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="materialConfirm"
          type="primary"
          :disabled="selectQualityCheck.PurchaseId ? false : true"
        >确定</el-button>
        <el-button @click="materialClose">取消</el-button>
      </span>
      <!-- Pagination -->
      <pagination
        :pg="materialForm.PageIndex"
        :size="materialForm.PageSize"
        :total="materialTotal"
        @currentChange="materialCurrentChange"
        @sizeChange="materialSizeChange"
      ></pagination>
    </el-dialog>
  </el-row>
</template>

<script>
import { StuffType, YNStatus, PurchaseType, PartnerType } from '@/enums/common'
import { SecurityUserState } from '@/enums/merchant'
import {
  SettingEnumeratorEnumeratorType,
  StoneColor,
  StoneClarity,
  StoneCut,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldLargeType,
  StuffIntakeOrderBasicState,
  StuffPurchaseOrderBasicState
} from '@/enums/stocking'
import {
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_UPDATE,
  STOCKING_API_STUFF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_STUFF_INTAKE_ORDER_ITEM_UPDATE,
  STOCKING_API_STUFF_INTAKE_ORDER_ITEM_CREATE,
  STOCKING_API_STUFF_INTAKE_ORDER_BASIC_WAIT,
  STOCKING_API_STUFF_INTAKE_ORDER_ITEM_DELETE,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS
} from '@/apis/stocking'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      StuffIntakeOrderBasicState,
      SettingEnumeratorEnumeratorType,
      StoneColor,
      StoneClarity,
      StuffType,
      YNStatus,
      StoneCut,
      PurchaseType,
      securityUserState: SecurityUserState,
      partnerType: PartnerType,
      detail: {},
      parameters: {
        IntakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      templateVisible: false,
      smartVisible: false,
      editVisible: false,
      editTitle: '',
      shelf: [],
      editForm: {
        PartnerId: '',
        StuffType: '',
        PreviousCode: '',
        ChargeUserId: '',
        ChargeUser: '',
        ExpressCode: '',
        Preprice: '',
        ActualDate: '',
        PurchaseType: PurchaseType.Purchase,
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      editRules: {
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ChargeUserId: {
          required: true,
          message: '请选择采购员',
          trigger: 'change'
        },
        PurchaseType: {
          required: true,
          message: '请选择进货方式',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择入库位置',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        }
      },
      returnVisible: false,
      returnReason: [],
      importOption: {
        OrderType:
          SettingAiimportTempletOrderType.StockingCloudStuffIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        KindTypeEk: 0,
        SmallType: 0
      },
      addVisible: false, // 插入空白行弹窗
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false, // 删除当前行弹窗
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      StoneWeight: [], // 石重范围
      PartType: [], // 配件名称
      currentRow: {}, // 当前选中行
      handleRow: {}, // 要进行操作的数据行
      isSaved: false,
      saveLoading: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
      materialVisible: false,
      materialForm: {
        PartnerId: 0,
        PurchaseCode: '',
        StuffType: 0,
        State: StuffPurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      materialTotal: 0,
      materialData: [],
      selectQualityCheck: {} // 选择的原料订货单
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
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    getDetail() {
      STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Preprice = this.$root.toFloat(this.detail.Preprice)
          this.materialForm.StuffType = this.detail.StuffType
          this.getData()
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STUFF_INTAKE_ORDER_ITEM_GETS(this.parameters).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if (!res.data.Data.Rows) {
            for (let i = 0; i < 10; i++) {
              switch (this.detail.StuffType) {
                case StuffType.Gold:
                  this.data.push({
                    IntakeId: this.parameters.IntakeId,
                    GoldType: '',
                    Quantity: '',
                    Weight: '',
                    GoldPrice: '',
                    CraftFee1: '',
                    CraftFee2: '',
                    OtherFee: '',
                    CostPrice: '',
                    Price: '',
                    Note: '',
                    isEdit: false,
                    isError: false
                  })
                  break
                case StuffType.Stone:
                  this.data.push({
                    IntakeId: this.parameters.IntakeId,
                    StoneClassTypeEk: '',
                    StonePackageNo: '',
                    StoneWeightEk: 0,
                    StoneColor: 0,
                    StoneClarity: 0,
                    StoneCut: 0,
                    StoneSpec: '',
                    Quantity: '',
                    Weight: '',
                    StonePrice1: '',
                    StonePrice2: '',
                    Price: '',
                    isEdit: false,
                    isError: false
                  })
                  break
                case StuffType.Part:
                  this.data.push({
                    IntakeId: this.parameters.IntakeId,
                    PartTypeEk: '',
                    Quantity: '',
                    Weight: '',
                    PartPrice1: '',
                    PartPrice2: '',
                    Price: '',
                    isEdit: false,
                    isError: false
                  })
                  break
                default:
                  break
              }
            }
          } else {
            switch (this.detail.StuffType) {
              case StuffType.Gold:
                this.data = this.data.map(item => {
                  let newItem = { ...item }
                  newItem.Weight = this.$root.toFloat(newItem.Weight, 3)
                  newItem.GoldPrice = this.$root.toFloat(newItem.GoldPrice)
                  newItem.CraftFee1 = this.$root.toFloat(newItem.CraftFee1)
                  newItem.CraftFee2 = this.$root.toFloat(newItem.CraftFee2)
                  newItem.OtherFee = this.$root.toFloat(newItem.OtherFee)
                  newItem.CostPrice = this.$root.toFloat(newItem.CostPrice)
                  newItem.Price = this.$root.toFloat(newItem.Price)
                  this.$set(newItem, 'isEdit', false)
                  this.$set(newItem, 'isError', false)
                  return newItem
                })
                break
              case StuffType.Stone:
                this.data = this.data.map(item => {
                  let newItem = { ...item }
                  newItem.Weight = this.$root.toFloat(newItem.Weight, 3)
                  newItem.Price = this.$root.toFloat(newItem.Price)
                  newItem.StonePrice1 = this.$root.toFloat(newItem.StonePrice1)
                  newItem.StonePrice2 = this.$root.toFloat(newItem.StonePrice2)
                  this.$set(newItem, 'isEdit', false)
                  this.$set(newItem, 'isError', false)
                  return newItem
                })
                break
              case StuffType.Part:
                this.data = this.data.map(item => {
                  let newItem = { ...item }
                  newItem.Weight = this.$root.toFloat(newItem.Weight, 3)
                  newItem.Price = this.$root.toFloat(newItem.Price)
                  newItem.PartPrice1 = this.$root.toFloat(newItem.PartPrice1)
                  newItem.PartPrice2 = this.$root.toFloat(newItem.PartPrice2)
                  this.$set(newItem, 'isEdit', false)
                  this.$set(newItem, 'isError', false)
                  return newItem
                })
                break
              default:
                break
            }
          }
          this.total = res.data.Data.Count
        }
      })
    },
    showEdit() {
      this.editTitle = `修改（${StuffType.Types[this.detail.StuffType]}）`
      let shelf = this.$store.getters.wareHouses.find(
        item => item.Id === this.detail.WarehouseId
      )
      this.shelf = shelf ? shelf.Childrens : []
      this.editVisible = true
    },
    chargeUserChange() {
      this.$store.getters.users.some(item => {
        if (item.UserId === this.detail.ChargeUserId) {
          this.detail.ChargeUser = item.TrueName || item.AliasName
        }
      })
    },
    // 新建选择订货单
    selectOrderForm() {
      this.materialVisible = true
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS(this.materialForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.materialData = res.data.Data.Rows || []
            this.materialTotal = res.data.Data.Count
          }
        }
      )
    },
    materialConfirm() {
      this.materialVisible = false
      this.detail.PreviousCode = this.selectQualityCheck.PurchaseCode
      this.detail.PreviousId = this.selectQualityCheck.PurchaseId
    },
    saveDetail(formName) {
      // 保存编辑明细
      this.$refs[formName].validate(valid => {
        if (valid) {
          STOCKING_API_STUFF_INTAKE_ORDER_BASIC_UPDATE({
            ...this.detail,
            Preprice: this.$root.toInt(this.detail.Preprice)
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.editVisible = false
              this.$message.success('修改成功')
              this.getDetail()
            }
          })
        } else {
          return false
        }
      })
    },
    qualityCheckChange(val) {
      this.selectQualityCheck = val
    },
    materialClose() {
      this.materialVisible = false
      this.selectQualityCheck = {}
      this.materialForm.PageIndex = 1
      this.materialForm.PageSize = 20
    },
    materialCurrentChange(val) {
      // 切换当前页
      this.materialForm.PageIndex = val
      this.selectOrderForm()
    },
    materialSizeChange(val) {
      // 切换每页显示条数
      this.materialForm.PageSize = val
      this.materialForm.PageIndex = 1
      this.selectOrderForm()
    },
    materialSort(sort) {
      // 表单排序
      switch (sort.prop) {
        case 'CreateTime':
          this.materialForm.OrderBy = 0
          break
        case 'PurchaseCode':
          this.materialForm.OrderBy = 1
          break
        case 'ActualDate':
          this.materialForm.OrderBy = 2
          break
        case 'ForwdDate':
          this.materialForm.OrderBy = 3
          break
        case 'CheckTime':
          this.materialForm.OrderBy = 4
          break
        default:
          this.materialForm.OrderBy = 0
          break
      }
      this.materialForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.selectOrderForm()
    },
    handleClose() {
      this.$refs.editForm.resetFields()
      this.editVisible = false
    },
    handleFocus(row) {
      switch (this.detail.StuffType) {
        case StuffType.Gold:
          this.$refs.goldTable.setCurrentRow(row)
          break
        case StuffType.Stone:
          this.$refs.stoneTable.setCurrentRow(row)
          break
        case StuffType.Part:
          this.$refs.partTable.setCurrentRow(row)
          break
        default:
          break
      }
      row.isEdit = true
      row.isError = false
      this.isSaved = true
    },
    handleBlur(row) {
      switch (this.detail.StuffType) {
        case StuffType.Gold:
          row.Price =
            row.Weight * row.GoldPrice +
            row.CraftFee1 * row.Weight +
            row.CraftFee2 * row.Quantity +
            row.OtherFee * 1
          break
        case StuffType.Stone:
          if (
            row.Weight * row.StonePrice2 != 0 &&
            row.Quantity * row.StonePrice1 != 0
          ) {
            row.Price = row.Weight * row.StonePrice2
          } else if (
            row.Weight * row.StonePrice2 == 0 &&
            row.Quantity * row.StonePrice1 != 0
          ) {
            row.Price = row.Quantity * row.StonePrice1
          } else if (
            row.Weight * row.StonePrice2 != 0 &&
            row.Quantity * row.StonePrice1 == 0
          ) {
            row.Price = row.Weight * row.StonePrice2
          } else {
            row.Price = row.Weight * row.StonePrice2
          }
          break
        case StuffType.Part:
          if (
            row.Weight * row.PartPrice2 != 0 &&
            row.Quantity * row.PartPrice1 != 0
          ) {
            row.Price = row.Weight * row.PartPrice2
          } else if (
            row.Weight * row.PartPrice2 == 0 &&
            row.Quantity * row.PartPrice1 != 0
          ) {
            row.Price = row.Quantity * row.PartPrice1
          } else if (
            row.Weight * row.PartPrice2 != 0 &&
            row.Quantity * row.PartPrice1 == 0
          ) {
            row.Price = row.Weight * row.PartPrice2
          } else {
            row.Price = row.Weight * row.PartPrice2
          }
          break
        default:
          break
      }
      row.Price = row.Price === 0 ? '' : row.Price.toFixed(2)
      if (row.Price > 9999999999) {
        this.$message.error('金额不能大于9999999999')
        row.Price = 9999999999
      }
      this.isSaved = true
    },
    async save() {
      let haveEdit = false
      let haveError = false
      let errorlist = []
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          switch (this.detail.StuffType) {
            case StuffType.Gold:
              if (this.data[i].GoldType === '') {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：成色不能为空<br>`)
              } else {
                this.$store.getters.stone.TypeArray.some(item => {
                  if (item.Id === this.data[i].StoneClassTypeEk) {
                    this.data[i].StoneClassTypeEv = item.Value
                  }
                })
              }
              if (
                this.$root.toInt(this.data[i].Weight) == 0 &&
                this.data[i].Quantity == 0
              ) {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：金重和件数不能同时为空<br>`)
              }
              break
            case StuffType.Stone:
              if (this.data[i].StoneClassTypeEk === '') {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：石类不能为空<br>`)
              } else {
                this.$store.getters.stone.TypeArray.some(item => {
                  if (item.Id === this.data[i].StoneClassTypeEk) {
                    this.data[i].StoneClassTypeEv = item.Value
                  }
                })
              }
              if (this.data[i].StonePackageNo == 0) {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：石号/包号不能为空<br>`)
              }
              if (this.data[i].StoneWeightEk !== 0) {
                this.StoneWeight.some(item => {
                  if (item.Id === this.data[i].StoneWeightEk) {
                    this.data[i].StoneWeightEv = item.Value
                  }
                })
              }
              if (
                this.$root.toInt(this.data[i].Weight) == 0 &&
                this.data[i].Quantity == 0
              ) {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：数量和重量不能同时为空<br>`)
              }
              break
            case StuffType.Part:
              if (this.data[i].PartTypeEk === '') {
                this.data[i].isEdit = false
                this.data[i].isError = true
                return this.$message.error('请选择配件名称')
              } else {
                this.PartType.some(item => {
                  if (item.Id === this.data[i].PartTypeEk) {
                    this.data[i].PartTypeEv = item.Value
                  }
                })
              }
              if (
                this.$root.toInt(this.data[i].Weight) == 0 &&
                this.data[i].Quantity == 0
              ) {
                this.data[i].isEdit = false
                this.data[i].isError = true
                errorlist.push(`序号${i + 1}：数量和重量不能同时为空<br>`)
              }
              break
            default:
              break
          }
          if (this.data[i].isEdit) {
            let res
            let param = { ...this.data[i] }
            param.Quantity = parseInt(param.Quantity)
            param.Weight = this.$root.toInt(param.Weight)
            param.GoldPrice = this.$root.toInt(param.GoldPrice)
            param.CraftFee1 = this.$root.toInt(param.CraftFee1)
            param.CraftFee2 = this.$root.toInt(param.CraftFee2)
            param.OtherFee = this.$root.toInt(param.OtherFee)
            param.CostPrice = this.$root.toInt(param.CostPrice)
            param.Price = this.$root.toInt(param.Price)
            param.StonePrice1 = this.$root.toInt(param.StonePrice1)
            param.StonePrice2 = this.$root.toInt(param.StonePrice2)
            param.PartPrice1 = this.$root.toInt(param.PartPrice1)
            param.PartPrice2 = this.$root.toInt(param.PartPrice2)

            this.saveLoading = true
            if (this.data[i].ItemId) {
              res = await STOCKING_API_STUFF_INTAKE_ORDER_ITEM_UPDATE(param)
            } else {
              res = await STOCKING_API_STUFF_INTAKE_ORDER_ITEM_CREATE(param)
            }
            this.saveLoading = false
            if (res.data.Code === 'CORRECT') {
              // this.$message.success('保存成功')
              this.data[i].isEdit = false
              if (!this.data[i].ItemId) {
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
      if (errorlist.length) {
        this.$alert(errorlist.join(''), '错误提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.isSaved = false
        }
      }
    },
    submit() {
      STOCKING_API_STUFF_INTAKE_ORDER_BASIC_WAIT({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push('/purchase/stockInventory/index')
        }
      })
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (this.addLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      let local
      local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        switch (this.detail.StuffType) {
          case StuffType.Gold:
            this.data.splice(this.handleRow.$index + local, 0, {
              IntakeId: this.parameters.IntakeId,
              GoldType: '',
              Quantity: '',
              Weight: '',
              GoldPrice: '',
              CraftFee1: '',
              CraftFee2: '',
              OtherFee: '',
              CostPrice: '',
              Price: '',
              Note: '',
              isEdit: false,
              isError: false
            })
            break
          case StuffType.Stone:
            this.data.splice(this.handleRow.$index + local, 0, {
              IntakeId: this.parameters.IntakeId,
              StoneClassTypeEk: '',
              StonePackageNo: '',
              StoneWeightEk: 0,
              StoneColor: 0,
              StoneClarity: 0,
              StoneCut: 0,
              StoneSpec: '',
              Quantity: '',
              Weight: '',
              StonePrice1: '',
              StonePrice2: '',
              Price: '',
              isEdit: false,
              isError: false
            })
            break
          case StuffType.Part:
            this.data.splice(this.handleRow.$index + local, 0, {
              IntakeId: this.parameters.IntakeId,
              PartTypeEk: '',
              Quantity: '',
              Weight: '',
              PartPrice1: '',
              PartPrice2: '',
              Price: '',
              isEdit: false,
              isError: false
            })
            break
          default:
            break
        }
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (
        this.data.length <= 1 &&
        !scope.row.ItemId &&
        this.parameters.PageIndex === 1
      ) {
        this.$message.warning('至少保留一行')
        return false
      }
      $event.currentTarget.blur()
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!scope.row.ItemId) {
            this.data.splice(scope.$index, 1)
            if (this.data.length === 0) {
              this.parameters.PageIndex = 1
              this.getData()
            }
            this.isSaved = false
          } else {
            STOCKING_API_STUFF_INTAKE_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              IntakeId: scope.row.IntakeId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.data.splice(scope.$index, 1)
                if (this.data.length === 0) {
                  if (this.parameters.PageIndex > 1) {
                    this.parameters.PageIndex = 1
                    this.getData()
                  } else {
                    switch (this.detail.StuffType) {
                      case StuffType.Gold:
                        this.data.push({
                          IntakeId: this.parameters.IntakeId,
                          GoldType: '',
                          Quantity: '',
                          Weight: '',
                          GoldPrice: '',
                          CraftFee1: '',
                          CraftFee2: '',
                          OtherFee: '',
                          CostPrice: '',
                          Price: '',
                          Note: '',
                          isEdit: false,
                          isError: false
                        })
                        break
                      case StuffType.Stone:
                        this.data.push({
                          IntakeId: this.parameters.IntakeId,
                          StoneClassTypeEk: '',
                          StonePackageNo: '',
                          StoneWeightEk: 0,
                          StoneColor: 0,
                          StoneClarity: 0,
                          StoneCut: 0,
                          StoneSpec: '',
                          Quantity: '',
                          Weight: '',
                          StonePrice1: '',
                          StonePrice2: '',
                          Price: '',
                          isEdit: false,
                          isError: false
                        })
                        break
                      case StuffType.Part:
                        this.data.push({
                          IntakeId: this.parameters.IntakeId,
                          PartTypeEk: '',
                          Quantity: '',
                          Weight: '',
                          PartPrice1: '',
                          PartPrice2: '',
                          Price: '',
                          isEdit: false,
                          isError: false
                        })
                        break
                      default:
                        break
                    }
                  }
                }
                this.isSaved = false
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
    },
    copySure() {
      // 确定复制
      if (this.copyLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      if (
        this.copyLineForm.local == 2 &&
        this.copyLineForm.current > this.data.length
      ) {
        return this.$message.warning('正确输入行数')
      }
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
      this.isSaved = true
      this.copyVisible = false
    },
    cancelClose() {
      this.copyVisible = false
      this.addVisible = false
      this.copyLineForm.local = this.addLineForm.local = '1'
      this.copyLineForm.rowsNum = this.copyLineForm.current = this.addLineForm.rowsNum = 1
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    getDropdown(EnumeratorType) {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: EnumeratorType,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (EnumeratorType === SettingEnumeratorEnumeratorType.StoneWeight) {
            this.StoneWeight = res.data.Data.Rows
          } else {
            this.PartType = res.data.Data.Rows
          }
        }
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {
        HasShelf: YNStatus.Yes,
        State: YNStatus.Yes
      })
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_GOLD_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_STONE_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.getDropdown(SettingEnumeratorEnumeratorType.StoneWeight)
      this.getDropdown(SettingEnumeratorEnumeratorType.PartType)
    }
  },
  created() {
    this.parameters.IntakeId = parseInt(this.$route.query.id)
    this.getDetail()
    this.getStoreAllType()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  components: {
    templateImport,
    smartImport,
    pagination
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.location {
  display: inline-block;
  /deep/ .el-select > .el-input {
    width: 140px;
  }
}
.shelf {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
}
.el-table .el-input-number--mini {
  width: 100%;
}
.el-back {
  height: 100%;
  float: right;
}
.handle-btn {
  font-size: 16px;
  color: #1f91df;
  i {
    margin-right: 8px;
    &:hover {
      color: blue;
      cursor: pointer;
    }
  }
}
.return-reason {
  font-size: 18px;
  vertical-align: -webkit-baseline-middle;
  padding-top: 2px;
  padding-left: 5px;
}
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
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
</style>
