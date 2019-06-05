<template>
  <div class="content" v-loading="$store.getters.tb_loading">
    <div class="mb">
      <div class="title mb">
        <span>编辑款式订货单（{{tableData.KindTypeEv}}）</span>
        <el-button name="btnEdit" @click="openEdit" class="el-back" type="text">修改</el-button>
      </div>
      <tabulation :data="item"></tabulation>
    </div>
    <div class="mb">
      <div class="mb">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" name="btnDialogSelectGoods" @click="openSelectGoods('添加款式')">添加款式</el-button>
            <!-- <el-button type="primary" name="btnDialogSelectGoods">按模板导入</el-button>
            <el-button type="primary" name="btnDialogSelectGoods">智能导入</el-button>-->
            <el-dropdown class="multi-operation" @command="openSelectStore" name="takeOrder">
              <el-button>
                提单
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="purchase">门店款式需求单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="12" class="tr" style="padding-right: 10px;">
            <span class="detail-info-num-item">
              数量：
              <b class="num">{{tableData.ItemQty}}</b>
            </span>
          </el-col>
        </el-row>
      </div>
      <!-- @module 数据表格 -->
      <el-table
        :data="data"
        ref="halfTable"
        element-loading-text="拼命加载中"
        highlight-current-row
        class="m-b-10 edit-table"
        v-scrollshow="handelScrollshow"
        height="600"
        v-loading="tableLoading"
        :row-class-name="setEditRow"
      >
        <el-table-column label="操作" width="100" fixed>
          <template slot-scope="scope">
            <div class="handle-btn">
              <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
              <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow(scope)" style="color: #d74040" title="删除此行"></i>
              <i name="copyShow" class="icon-copy1 handel-icon" @click="copyShow(scope)" style="color: #7798af" title="复制此行"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="45" fixed>
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="PurchaseCode" label="序号" min-width="50" fixed></el-table-column> -->
        <el-table-column label="款式" width="200" show-overflow-tooltip fixed>
          <template slot="header">
            <span class="red">*</span>款式
          </template>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
                <div class="fl item-img" slot="reference">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5 butHand">
                </div>
              </el-popover>
              <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
              <div>
                <div class="fl" style="width: 95px;">
                  <el-tooltip class="item" effect="dark" :content="scope.row.StyleName" placement="top">
                    <div v-text="scope.row.StyleName" class="ellipsis"></div>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="scope.row.StyleCode" placement="top">
                    <div v-text="scope.row.StyleCode" class="ellipsis"></div>
                  </el-tooltip>
                </div>
                <i slot="suffix" class="el-icon-more gesture fl" @click="openSelectGoods('选择款式',scope.row, scope.$index)"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="款号" min-width="100">
          <template slot="header"><span class="red">*</span>款号</template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.StyleCode" @change="handleFocus(scope.row)" disabled>
              
            </el-input>
          </template>
        </el-table-column>-->
        <!-- <el-table-column prop="StyleName" label="款式名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.StyleName" @focus="handleFocus(scope.row)" disabled></el-input>
          </template>
        </el-table-column>-->
        <el-table-column label="金重(g)" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <!-- <el-input v-model="scope.row.GoldWeight" @focus="handleFocus(scope.row)" disabled></el-input> -->
            <el-select
              filterable
              name="GoldWeight"
              v-model="scope.row.GoldWeight"
              @change="handleFocus(scope.row)"
              :disabled="scope.row.GoldWeights.split(',',scope.row.GoldWeights.split(',').length - 1)[0] !== ''  ? false : true"
            >
              <template v-if="scope.row.GoldWeights.length">
                <el-option v-for="(item, index) in scope.row.GoldWeights.split(',',scope.row.GoldWeights.split(',').length - 1)" :key="index" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="主石重(ct)" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <!-- <el-input v-model="scope.row.StoneWeight" @focus="handleFocus(scope.row)" disabled></el-input> -->
            <el-select
              filterable
              name="StoneWeight"
              v-model="scope.row.StoneWeight"
              @change="handleFocus(scope.row)"
              :disabled="scope.row.StoneWeights.split(',',scope.row.StoneWeights.split(',').length - 1)[0] !== '' ? false : true"
            >
              <template v-if="scope.row.StoneWeights.length">
                <el-option v-for="(item, index) in scope.row.StoneWeights.split(',',scope.row.StoneWeights.split(',').length - 1)" :key="index" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="主石颜色" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-select
              filterable
              name="StoneColor"
              v-model="scope.row.StoneColor"
              @change="handleFocus(scope.row)"
              :disabled="scope.row.StoneColors.split(',',scope.row.StoneColors.split(',').length - 1)[0] !== '' ? false : true"
              placeholder="请选择"
            >
              <template v-if="scope.row.StoneColors.length">
                <el-option v-for="(item, index) in scope.row.StoneColors.split(',',scope.row.StoneColors.split(',').length - 1)" :key="index" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="主石净度" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-select
              filterable
              name="StoneClarity"
              v-model="scope.row.StoneClarity"
              @change="handleFocus(scope.row)"
              :disabled="scope.row.StoneClaritys.split(',',scope.row.StoneClaritys.split(',').length - 1)[0] === '' ? true : false"
              placeholder="请选择"
            >
              <template v-if="scope.row.StoneClaritys.length">
                <el-option v-for="(item, index) in scope.row.StoneClaritys.split(',',scope.row.StoneClaritys.split(',').length - 1)" :key="index" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-select
              filterable
              name="Size"
              v-model="scope.row.Size"
              @change="handleFocus(scope.row)"
              :disabled="scope.row.Sizes.split(',',scope.row.Sizes.split(',').length - 1)[0] !== '' ? false : true"
              placeholder="请选择"
            >
              <template v-if="scope.row.StoneClaritys.length">
                <el-option v-for="(item, index) in scope.row.Sizes.split(',',scope.row.Sizes.split(',').length - 1)" :key="index" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="100">
          <template slot="header">
            <span class="red">*</span>数量
          </template>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input v-model="scope.row.Quantity" @focus="handleFocus(scope.row)"  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0, false)" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="供应商" min-width="100">
          <template slot="header">
            <span class="red">*</span>供应商
          </template>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-select filterable name="PartnerId" v-model="scope.row.PartnerId" @change="handleFocus(scope.row, scope.row.StyleId, scope.$index)" placeholder="请选择">
              <el-option label="请选择" :value="0"></el-option>
              <template v-for="group in scope.row.SupplierList">
                <el-option-group v-if="group.options.length" :key="group.label" :label="group.label">
                  <template v-for="(item, index) in group.options">
                    <el-option
                      v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                      :key="index"
                      :label="item.Value"
                      :value="Number(item.Id)"
                    ></el-option>
                  </template>
                </el-option-group>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="PartnerScode" label="供应商款号" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="参考进货价/工费" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">{{$root.toFloat(scope.row.ReferPrice)}}</template>
        </el-table-column>
        <el-table-column prop="CraftFee1" label="工费①按克" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input v-model="scope.row.CraftFee1" @focus="handleFocus(scope.row)" @keyup.native="scope.row.CraftFee1 = $root.toFixed(scope.row.CraftFee1, 2)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="CraftFee2" label="工费②按件" min-width="100">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input v-model="scope.row.CraftFee2" @focus="handleFocus(scope.row)" @keyup.native="scope.row.CraftFee2 = $root.toFixed(scope.row.CraftFee2, 2)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ItemNote" label="备注" min-width="120">
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input v-model="scope.row.ItemNote" @blur="scope.row.ItemNote = scope.row.ItemNote.trim()" @focus="handleFocus(scope.row)" :maxlength="200"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pg="parameters.PageIndex" :size="parameters.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 数据表格 -->
      <input type="file" id="imgUploaderInput" style="display: none;" accept="image/jpg, image/jpeg, image/png" @change="uploadChange">
    </div>
    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" ref="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：" prop="rowsNum">
          <el-input name="rowsNum" v-model="addLineForm.rowsNum" @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：" prop="local">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addCancelColse">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px" @close="colseCopy">
      <el-form :model="copyLineForm" ref="copyLineForm" @submit.native.prevent>
        <el-form-item label="行数：" prop="rowsNum">
          <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
          <el-input name="rowsNum" v-model="copyLineForm.rowsNum" @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：" prop="local">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">
              复制到第
              <el-input-number name="rowsNum" v-model="copyLineForm.current" :controls="false" style="width: 50px"></el-input-number>行
            </el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="colseCopy">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
    <!-- 选择添加款式 -->
    <el-dialog :title="selectGoodsTitle" :visible.sync="selectGoodsVisible" width="1000px" v-if="selectGoodsVisible">
      <el-form :model="selectGoods" ref="selectStyle" lable-width="120px" class="item-lh-26" :inline="true">
        <el-form-item prop="KindTypeEk">
          <el-select filterable name="KindTypeEk" v-model="selectGoods.KindTypeEk" placeholder="所有种类" @change="getSelectGoods">
            <el-option label="所有种类" :value="0"></el-option>
            <el-option v-for="(item,index) in kind" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="CategoryTypeEk">
          <el-select filterable name="CategoryTypeEk" v-model="selectGoods.CategoryTypeEk" placeholder="所有品类" @change="getSelectGoods">
            <el-option label="所有品类" :value="0"></el-option>
            <el-option v-for="(item, index) in category" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="StyleCode">
          <el-input name="StyleCode" v-model="selectGoods.StyleCode" :maxlength="50" @keyup.enter.native="getSelectGoods" placeholder="请输入款号">
            <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getSelectGoods"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="selectGoodsData"
        @selection-change="expandRow"
        @current-change="selectGoodsChange"
        :highlight-current-row="selectGoodsTitle != '添加款式'"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="selection" fixed v-if="selectGoodsTitle == '添加款式'"></el-table-column>
        <el-table-column label="款式" min-width="140" show-overflow-tooltip fixed>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl !== ''">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
                <div class="fl item-img" slot="reference">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
                </div>
              </el-popover>
              <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
              <div v-text="scope.row.StyleName"></div>
              <div v-text="scope.row.StyleCode"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">{{schemeDate(scope.row.CreateTime)}}</template>
        </el-table-column>
        <el-table-column prop="UpperTime" label="新款日期" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">{{schemeDate(scope.row.UpperTime)}}</template>
        </el-table-column>
        <el-table-column label="模版来源" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{styleBasicTemplateType.Types[scope.row.TemplateType]}}</template>
        </el-table-column>
      </el-table>
      <pagination :pg="selectGoods.PageIndex" :size="selectGoods.PageSize" :total="selectGoodsTotal" @currentChange="selectGoodsCurrentChange" @sizeChange="selectGoodSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button name="confirmAdd" type="primary" @click="addToSelect(false)" v-if="selectGoodsTitle === '添加款式'" :disabled="expandRows.length ? false : true">添加</el-button>
        <el-button name="confirmAddClose" type="primary" @click="addAndClose" v-if="selectGoodsTitle === '添加款式'" :disabled="expandRows.length ? false : true">添加并关闭</el-button>
        <el-button name="confirmClick" type="primary" @click="addAndClose" v-if="selectGoodsTitle === '选择款式'" :disabled="selectGoodsObj.StyleId ? false : true">确定</el-button>
        <el-button name="confirmClose" @click="closeSelectGoods">取消</el-button>
      </span>
    </el-dialog>
    <!-- 选择需求单 -->
    <el-dialog title="选择门店款式需求单" :visible.sync="storeStyleVisible" width="1000px" v-if="storeStyleVisible" v-loading="$store.getters.is_loading" :before-close="closeSelectStore">
      <el-form :model="selectStoreOrder" ref="selectStyle" lable-width="120px" class="item-lh-26" :inline="true">
        <el-form-item prop="StorechterId">
          <el-select filterable name="StorechterId" v-model="selectStoreOrder.StorechterId" placeholder="所有门店" @change="getSelectStore">
            <el-option label="所有门店" value="0"></el-option>
            <el-option v-for="(item,index) in storeList" :key="index" :label="item.Value" :value="String(item.CharacterId)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="RequireCode">
          <el-input name="RequireCode" placeholder="请输入单据编号" v-model="selectStoreOrder.RequireCode" :maxlength="50" @keyup.enter.native="getSelectStore">
            <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getSelectStore"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="selectStoreData" @current-change="selectStoreChange" highlight-current-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="RequireCode" label="单据编号" min-width="140" show-overflow-tooltip sortable="custom" fixed></el-table-column>
        <el-table-column prop="StoreName" label="门店" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="门店类型" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{storeType.Types[scope.row.StoreType]}}</template>
        </el-table-column>
        <el-table-column prop="KindTypeEv" label="货品类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="120" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">{{schemeDate(scope.row.CreateTime)}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="数量" min-width="80" show-overflow-tooltip sortable="custom"></el-table-column>
      </el-table>
      <pagination :pg="selectStoreOrder.PageIndex" :size="selectStoreOrder.PageSize" :total="selectStoreTotal" @currentChange="storeStyleCurrent" @sizeChange="storeStyleSize"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button name="confirmClick" type="primary" @click="confirmSelectStore('selectStyle')" v-loading="$store.getters.is_loading" :disabled="selectStoreObj.RequireId ? false : true">确定</el-button>
        <el-button name="confirmClose" @click="closeSelectStore">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改款式订货单" :visible.sync="newVisible" width="600px" @close="closeNewForm">
      <el-form :model="newStyleData" label-width="120px" :rules="newRules" ref="newForm">
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker :clearable="false" name="ActualDate" v-model="newStyleData.ActualDate" value-format="yyyy-MM-dd" :picker-options="$store.getters.businessDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="进货方式：" prop="PurchaseType">
          <el-radio-group name="PurchaseType" v-model="newStyleData.PurchaseType">
            <el-radio :label="Number(purchaseType.Purchase)">{{purchaseType.Types[purchaseType.Purchase]}}</el-radio>
            <el-radio :label="Number(purchaseType.WeiwStuff)">{{purchaseType.Types[purchaseType.WeiwStuff]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-row>
            <el-col :span="12">
              <el-input name="Preprice" v-model="newStyleData.Preprice" @keyup.native="newStyleData.Preprice = $root.toFixed(newStyleData.Preprice, 2, true)" maxlength="10"></el-input>
            </el-col>
            <el-col :span="12">
              <span class="des">审核后产生应付款</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="预计到货日期：" prop="ForwdDate">
          <el-date-picker :clearable="false" name="ForwdDate" v-model="newStyleData.ForwdDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" @blur="newStyleData.Note = newStyleData.Note.trim()" v-model="newStyleData.Note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="newSave('newForm')">保存</el-button>
        <el-button name="btnClose" @click="closeNewForm">取消</el-button>
      </div>
    </el-dialog>
    <div class="buttons">
      <el-button v-if="(tableData.State == orderBasicState.Draft || tableData.State == orderBasicState.Reject) && !isSelectd" @click="orderSubmit" name="btnsubmitAudit" type="primary">提交审核</el-button>
      <el-button v-if="isSelectd" @click="saveRows" :loading="$store.getters.is_loading" name="btnsubmitAudit" type="primary">保存</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
      <span class="end-right">注：审核后自动按供应商拆分成多个订货单。</span>
    </div>
  </div>
</template>

<script>
import {
  YNStatus,
  StoreType,
  PurchaseType,
  PartnerType
} from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  StyleBasicTemplateType,
  StylePurchaseOrderBasicState,
  StyleBasicState,
  StyleRequireOrderBasicState
} from '@/enums/stocking'
import {
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GET,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_GETS,
  // STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS,
  STOCKING_API_STYLE_BASIC_GETS,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_UPDATE,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_CREATE,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GETS,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_SELECTREQUIRECREATE,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_WAIT,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_DELETE,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_UPDATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICSLIST,
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST
} from '@/apis/merchant.js'
import tabulation from '@/components/scrm/tabulation.vue'
import pagination from '@/components/pagination'
import dayjs from 'dayjs'
export default {
  components: {
    tabulation,
    pagination
  },
  data() {
    return {
      YNStatus,
      partnerType: PartnerType,
      storeType: StoreType, // 门店类型
      purchaseType: PurchaseType, // 进货方式
      orderBasicState: StylePurchaseOrderBasicState,
      styleBasicTemplateType: StyleBasicTemplateType,
      kind: [], // 种类
      storeList: [], // 门店下拉
      category: [], // 品类下拉
      item: [],
      tableData: {
        KindTypeEv: ''
      },
      data: [],
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
      currentRow: {}, // 当前选中行
      handleRow: {}, // 要进行操作的数据行
      selectGoodsVisible: false, // 选择款式弹窗
      lessVisible: false,
      parameters: {
        PurchaseId: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      }, // 款式商品筛选
      total: 0,
      selectGoods: {
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        State: StyleBasicState.Done,
        KindTypeEk: 0,
        CategoryTypeEk: 0,
        StyleCode: ''
      }, // 款式样式筛选
      selectGoodsData: [], // 款式弹窗数据
      selectGoodsTotal: 0, // 款式总数
      selectGoodsTitle: '', // 款式标题
      selectGoodsObj: {}, // 选择款式数据
      expandRows: [], // 新增款式数据
      selectRows: null, // 选择行数
      storeStyleVisible: false, // 选择门店款式订货单
      selectStoreOrder: {
        StorechterId: '0',
        RequireCode: '',
        OrderBy: 0,
        State: StyleRequireOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      selectStoreData: [], // 门店需求单数据
      selectStoreTotal: 0, // 门店需求单总数
      selectStoreObj: {}, // 选择门店需求单数据
      newVisible: false,
      newStyleData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date()
        }
      },
      pickersOptions: {
        disabledDate(time) {
          return time.getTime() < new Date() - 8.64e7
        }
      },
      newRules: {
        PurchaseType: [
          { required: true, message: '请选择进货方式', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        ForwdDate: [
          { required: true, message: '请选择预计到货日期', trigger: 'change' }
        ],
      }, // 新建验证
      isSelectd: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
      tableLoading: false,
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
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GET({
        PurchaseId: this.parameters.PurchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const detail = res.data.Data
          this.tableData = res.data.Data
          this.newStyleData = {
            ...res.data.Data,
            Preprice: this.$root.toFloat(res.data.Data.Preprice)
          }
          this.item = [
            [
              {
                title: '单号',
                content: detail.PurchaseCode
              },
              {
                title: '创建',
                content: `${detail.CreateUser} ${this.schemeDate(
                  detail.CreateTime
                )}`
              },
              {
                title: '审核',
                content: `${
                  detail.State === this.orderBasicState.Audit || detail.State === this.orderBasicState.Reject
                    ? `${detail.CheckUser} ${this.schemeDate(detail.CheckTime)}`
                    : '-'
                }`
              }
            ],
            [
              {
                title: '业务日期',
                content: this.filterDate(detail.ActualDate)
              },
              {
                title: '进货方式',
                content: PurchaseType.Types[detail.PurchaseType]
              },
              {
                title: '应付款',
                content: this.$root.toFloat(detail.Preprice)
              }
            ],
            [
              {
                title: '预计到货日期',
                content: this.filterDate(detail.ForwdDate)
              },
              {
                title: '供应商',
                content: detail.PartnerName
              },
              {
                title: '备注',
                content: detail.Note
              }
            ]
          ]
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getItems() {
      this.tableLoading = true
      // 货品列表
      STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          if (res.data.Data.Count == 0) {
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                PurchaseId: this.parameters.PurchaseId,
                ItemId: '',
                ImageUrl: '',
                StyleCode: '',
                StyleName: '',
                GoldWeight: '',
                StoneWeight: '',
                StoneColor: '',
                StoneClarity: '',
                Size: '',
                Quantity: '',
                PartnerType: 0,
                PartnerScode: '',
                ReferPrice: 0,
                ItemNote: '',
                CraftFee1: '',
                CraftFee2: '',
                GoldWeights: '',
                Sizes: '',
                StoneClaritys: '',
                StoneWeights: '',
                StoneColors: '',
                SupplierList: [],
                NoFilterSupplier: [],
                isEdit: false,
                isError: false
              })
            }
          } else {
            const data = res.data.Data.Rows.map(item => {
              let newItem = {
                ...item,
                CraftFee1: this.$root.toFloat(item.CraftFee1),
                CraftFee2: this.$root.toFloat(item.CraftFee2),
              }
              this.$set(newItem, 'isEdit', false)
              this.$set(newItem, 'isError', false)
              return newItem
            })
            this.data = data
            this.data.map(item => {
              const arr = this.getSupplierNumber(item.StyleId)
              arr.then(rej => {
                const list = [
                  {
                    label: '采购过',
                    options: []
                  },
                  {
                    label: '未采购过',
                    options: []
                  }
                ]
                rej.Rows.map(item => {
                  if (item.IsBuy === YNStatus.Yes) {
                    list[0].options.push(item)
                  } else {
                    list[1].options.push(item)
                  }
                })
                item.NoFilterSupplier = rej.Rows
                item.SupplierList = list
              })
            })
          }
          this.$store.commit('SET_TB_LOADING', false)
          this.total = res.data.Data.Count || 0
        }
        this.tableLoading = false
      })
    },
    // 打开编辑弹窗
    openEdit() {
      this.newVisible = true
    },
    // 新建保存
    newSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newStyleData,
            ForwdDate: this.newStyleData.ForwdDate
              ? this.newStyleData.ForwdDate
              : '1900-01-01',
            PurchaseType: Number(this.newStyleData.PurchaseType),
            KindTypeEk: Number(this.newStyleData.KindTypeEk),
            Preprice: this.$root.toInt(Number(this.newStyleData.Preprice))
          }
          STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getData()
              this.closeNewForm()
            }
          })
        }
      })
    },
    // 新建取消
    closeNewForm() {
      this.$refs['newForm'].resetFields()
      this.newVisible = false
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      if (parseInt(dayjs(data).format('YYYY')) === new Date().getFullYear()) {
        return dayjs(data).format('MM-DD HH:mm:ss')
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    filterDate(value, fomatter = 'YYYY-MM-DD') {
      const ignore = ['1900', '9999']
      if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
        return '-'
      }
      if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
        return dayjs(value).format(fomatter.replace('YYYY-', ''))
      }
      return dayjs(value).format(fomatter)
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row
      this.isSelectd = true
      let api
      if (oldRow) {
        if (row === null) {
          return
        }
        if (oldRow.StyleCode === '') {
          return this.$message.error('请选择款号')
        }
        if (oldRow.Quantity === '' || oldRow.Quantity == 0) {
          return this.$message.error('请输入数量')
        }
        if (!/(^[1-9]\d*$)/.test(oldRow.Quantity)) {
          return this.$message.error('请输入正确数量')
        }
        if (
          oldRow.CraftFee1 != '' &&
          oldRow.CraftFee1 != 0 &&
          !/^(?!0(\.0{1,2})?$)(([1-9]\d{0,8})|0)(\.\d{1,2})?$/.test(
            String(oldRow.CraftFee1)
          )
        ) {
          return this.$message.error('工费①按克输入有误')
        }
        if (
          oldRow.CraftFee2 != '' &&
          !/^(?!0(\.0{1,2})?$)(([1-9]\d{0,8})|0)(\.\d{1,2})?$/.test(
            String(oldRow.CraftFee2)
          )
        ) {
          return this.$message.error('工费②按件输入有误')
        }
        if (
          !oldRow.PartnerId ||
          oldRow.PartnerId == '' ||
          oldRow.PartnerId == 0
        ) {
          return this.$message.error('请选择供应商')
        }
        const para = {
          PurchaseId: this.parameters.PurchaseId,
          ItemId: oldRow.ItemId,
          ImageUrl: oldRow.ImageUrl,
          StyleCode: oldRow.StyleCode,
          StyleId: oldRow.StyleId,
          StyleName: oldRow.StyleName,
          GoldWeight: oldRow.GoldWeight,
          StoneWeight: oldRow.StoneWeight,
          StoneColor: oldRow.StoneColor,
          StoneClarity: oldRow.StoneClarity,
          Size: oldRow.Size,
          Quantity: Number(oldRow.Quantity),
          PartnerType: oldRow.PartnerType,
          PartnerScode: oldRow.PartnerScode,
          ReferPrice: Number(oldRow.ReferPrice),
          ItemNote: oldRow.ItemNote,
          CraftFee1: Number(this.$root.toInt(oldRow.CraftFee1)),
          CraftFee2: Number(this.$root.toInt(oldRow.CraftFee2)),
          PartnerId: Number(oldRow.PartnerId)
        }
        if (!oldRow.ItemId) {
          const partner = this.supplierList.find(
            item => item.Id == oldRow.PartnerId
          )
          para.PartnerName = partner.Value
          api = STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_CREATE
        } else {
          api = STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_UPDATE
        }
        api(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            oldRow.isNew = false
            if (!oldRow.ItemId) {
              oldRow.ItemId = res.data.Data
            }
            this.getData()
          }
        })
      }
    },
    async saveRows() {
      let haveEdit = false
      let haveError = false
      this.$store.commit('SET_BTN_LOADING', true)
      let errorlist = []
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          if (!this.data[i].StyleCode) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：请选择款式<br>`)
            continue
          }
          if (
            this.data[i].Quantity == '' ||
            !/(^[1-9]\d*$)/.test(this.data[i].Quantity)
          ) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：请输入正确数量<br>`)
            continue
          }
          if (this.data[i].PartnerId == '' || this.data[i].PartnerId == 0) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：请选择供应商<br>`)
            continue
          }
          if (this.data[i].isEdit || this.data[i].isError) {
            let res
            let param = { ...this.data[i] }
            param.Quantity = Number(this.data[i].Quantity)
            param.RequireId = this.parameters.RequireId
            param.ReferPrice = Number(this.data[i].ReferPrice)
            param.CraftFee1 = this.$root.toInt(this.data[i].CraftFee1)
            param.CraftFee2 = this.$root.toInt(this.data[i].CraftFee2)
            if (!this.data[i].ItemId) {
              res = await STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_CREATE(param)
            } else {
              res = await STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_UPDATE(param)
            }
            if (res.data.Code === 'CORRECT') {
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
      this.$store.commit('SET_BTN_LOADING', false)
      if (errorlist.length) {
        this.$alert(errorlist.join(''), '错误提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.isSelectd = false
        }
        this.getData()
      }
    },
    handleFocus(row, id, index) {
      row.isEdit = true
      row.isError = false
      this.isSelectd = true
      if (id) {
        const selectSupplier = row.NoFilterSupplier.filter(
          item => item.Id === row.PartnerId
        )
        if (selectSupplier.length) {
          this.data[index].PartnerScode = selectSupplier[0].LastStyleCode || ''
          this.data[index].ReferPrice = selectSupplier[0].ReferPrice || 0
          this.data[index].PartnerId = selectSupplier[0].Id || ''
          this.data[index].PartnerName = selectSupplier[0].Value || ''
        } else {
          this.data[index].PartnerScode = ''
          this.data[index].ReferPrice = 0
          this.data[index].PartnerId = ''
          this.data[index].PartnerName = ''
        }
      }
    },
    async getSupplierNumber(id) {
      const res = await MERCHANT_API_DROPDOWN_PARTNERBASICSLIST({ StyleId: id })
      if (res.data.Code == 'CORRECT') {
        const obj = res.data.Data
        return obj
      } else {
        return {}
      }
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (parseFloat(this.addLineForm.rowsNum) > 50) {
        this.$message.warning('最多新增50行')
        return false
      }
      const local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.data.splice(this.handleRow.$index + local, 0, {
          PurchaseId: this.parameters.PurchaseId,
          ItemId: '',
          imagesUrl: '',
          StyleCode: '',
          StyleName: '',
          GoldWeight: '',
          StoneWeight: '',
          StoneColor: '',
          StoneClarity: '',
          Size: '',
          Quantity: '',
          PartnerType: 0,
          PartnerScode: '',
          ReferPrice: 0,
          CraftFee1: '',
          CraftFee2: '',
          GoldWeights: '',
          Sizes: '',
          StoneClaritys: '',
          StoneWeights: '',
          StoneColors: '',
          Note: '',
          isEdit: false,
          isError: false
        })
      }
      this.addCancelColse()
    },
    addCancelColse() {
      this.$refs['addLineForm'].resetFields()
      this.addVisible = false
    },
    deleteShow(scope) {
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!scope.row.ItemId || scope.row.ItemId == '') {
            this.data.splice(scope.$index, 1)
          } else {
            STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              PurchaseId: scope.row.PurchaseId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.data.splice(scope.$index, 1)
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
      if (parseFloat(this.copyLineForm.rowsNum) > 50) {
        this.$message.warning('最多50行')
        return false
      }
      if (
        (!Number(this.copyLineForm.current) ||
          parseFloat(this.copyLineForm.current) > this.data.length) &&
        this.copyLineForm.local === '2'
      ) {
        this.$message.warning('正确输入行数')
        return false
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
      this.isSelectd = true
      // if (this.handleRow.row.ItemId != '') {
      //   const para = {
      //     ...this.handleRow.row,
      //     CraftFee1: Number(this.$root.toInt(this.handleRow.row.CraftFee1)),
      //     CraftFee2: Number(this.$root.toInt(this.handleRow.row.CraftFee2)),
      //     ReferPrice: Number(this.$root.toInt(this.handleRow.row.ReferPrice))
      //   }
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.createData(para).then(res => {
      //       if (res.data.Code === 'CORRECT') {
      //         this.data.splice(local, 0, {
      //           ...this.handleRow.row,
      //           ItemId: res.data.Data
      //         })
      //         this.isSelectd = false
      //       }
      //     })
      //   }
      // } else {
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.data.splice(local, 0, {
      //       ...this.handleRow.row,
      //       isNew: true
      //     })
      //   }
      // }
      this.colseCopy()
    },
    colseCopy() {
      this.copyLineForm.current = 1
      this.$refs['copyLineForm'].resetFields()
      this.copyVisible = false
    },
    async createData(data) {
      const res = await STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_CREATE(data)
      return res
    },
    // 打开选择款式弹窗
    openSelectGoods(title, data, index) {
      if (data) {
        this.selectRows = index
      }
      this.selectGoodsVisible = true
      this.selectGoodsTitle = title
      this.getSelectGoods()
    },
    // 获取款式弹窗数据
    getSelectGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STYLE_BASIC_GETS(this.selectGoods).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.selectGoodsData = res.data.Data.Rows
          this.selectGoodsTotal = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 添加选择款式
    async addToSelect(isColse) {
      if (this.selectGoodsTitle == '选择款式') {
        const obj = {
          ...this.data[this.selectRows],
          ...this.selectGoodsObj,
          Quantity: 1,
          GoldWeight: '',
          StoneWeight: '',
          StoneColor: '',
          StoneClarity: '',
          Size: '',
          Note: '',
          SupplierList: [],
          NoFilterSupplier: [],
          PurchaseId: this.parameters.PurchaseId,
          CraftFee1: '',
          CraftFee2: '',
          isEdit: true,
          isError: false
        }
        if (this.data[this.selectRows].ItemId) {
          const arr = this.getSupplierNumber(obj.StyleId)
          arr.then(rej => {
            const list = [
              {
                label: '采购过',
                options: []
              },
              {
                label: '未采购过',
                options: []
              }
            ]
            rej.Rows.map(item => {
              if (item.State === YNStatus.Yes) {
                if (item.IsBuy === YNStatus.Yes) {
                  list[0].options.push(item)
                } else {
                  list[1].options.push(item)
                }
              }
            })
            obj.NoFilterSupplier = rej.Rows
            obj.SupplierList = list
            obj.PartnerId = list[0].options.length ? list[0].options[0].Id : 0
            obj.PartnerName = list[0].options.length
              ? list[0].options[0].Value
              : ''
            obj.PartnerScode = list[0].options.length
              ? list[0].options[0].LastStyleCode
              : ''
            obj.ReferPrice = list[0].options.length
              ? list[0].options[0].ReferPrice
              : ''
            // STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_UPDATE(obj).then(res => {
            //   if(res.data.Code === 'CORRECT') {
            //     this.data.splice(this.selectRows, 1, obj)
            //     this.isSelectd = false
            //   }
            // })
          })
          this.data.splice(this.selectRows, 1, obj)

          if (isColse) {
            this.closeSelectGoods()
          }
        } else {
          const arr = this.getSupplierNumber(obj.StyleId)
          arr.then(rej => {
            const list = [
              {
                label: '采购过',
                options: []
              },
              {
                label: '未采购过',
                options: []
              }
            ]
            rej.Rows.map(item => {
              if (item.State === YNStatus.Yes) {
                if (item.IsBuy === YNStatus.Yes) {
                  list[0].options.push(item)
                } else {
                  list[1].options.push(item)
                }
              }
            })
            obj.NoFilterSupplier = rej.Rows
            obj.SupplierList = list
            obj.PartnerId = list[0].options.length ? list[0].options[0].Id : 0
            obj.PartnerName = list[0].options.length
              ? list[0].options[0].Value
              : ''
            obj.PartnerScode = list[0].options.length
              ? list[0].options[0].LastStyleCode
              : ''
            obj.ReferPrice = list[0].options.length
              ? list[0].options[0].ReferPrice
              : ''
            // this.createData(obj).then(res => {
            //   if(res.data.Code === 'CORRECT') {
            //     obj.ItemId = res.data.Data
            //     this.data.splice(this.selectRows, 1, obj)
            //     this.isSelectd = false
            //   }
            // })
          })
          this.data.splice(this.selectRows, 1, obj)
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          if (isColse) {
            this.closeSelectGoods()
          }
          this.isSelectd = true
        }
      } else {
        this.expandRows.reverse()
        this.expandRows.map(item => {
          const obj = {
            ...item,
            Quantity: 1,
            GoldWeight: '',
            StoneWeight: '',
            StoneColor: '',
            StoneClarity: '',
            Size: '',
            Note: '',
            CraftFee1: '',
            CraftFee2: '',
            SupplierList: [],
            NoFilterSupplier: [],
            PurchaseId: this.parameters.PurchaseId,
            isEdit: true,
            isError: false
          }
          const arr = this.getSupplierNumber(obj.StyleId)
          arr.then(rej => {
            const list = [
              {
                label: '采购过',
                options: []
              },
              {
                label: '未采购过',
                options: []
              }
            ]
            rej.Rows.map(item => {
              if (item.State === YNStatus.Yes) {
                if (item.IsBuy === YNStatus.Yes) {
                  list[0].options.push(item)
                } else {
                  list[1].options.push(item)
                }
              }
            })
            obj.NoFilterSupplier = rej.Rows
            obj.SupplierList = list
            obj.PartnerId = list[0].options.length ? list[0].options[0].Id : 0
            obj.PartnerName = list[0].options.length
              ? list[0].options[0].Value
              : ''
            obj.PartnerScode = list[0].options.length
              ? list[0].options[0].LastStyleCode
              : ''
            obj.ReferPrice = list[0].options.length
              ? list[0].options[0].ReferPrice
              : ''
            // this.createData(obj).then(res => {
            //   if(res.data.Code === 'CORRECT') {
            //     obj.ItemId = res.data.Data
            //     this.data.unshift(obj)
            //   }
            // })
          })
          this.data.unshift(obj)
        })
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.isSelectd = true
        if (isColse) {
          this.closeSelectGoods()
        }
      }
    },
    // 添加并关闭选择款式
    addAndClose() {
      this.addToSelect(true)
    },
    // 关闭选择款式
    closeSelectGoods() {
      this.selectGoodsVisible = false
      this.selectGoodsTitle = ''
      this.selectRows = null
      this.selectGoodsObj = {}
      this.expandRows = []
      this.selectGoods = {
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        State: StyleBasicState.Done,
        KindTypeEk: 0,
        CategoryTypeEk: 0,
        StyleCode: ''
      }, // 款式样式筛选
      this.$refs['selectStyle'].resetFields()
    },
    // 选择款式
    selectGoodsChange(row) {
      this.selectGoodsObj = row
    },
    // 打开选择门店需求单弹窗
    openSelectStore() {
      this.storeStyleVisible = true
      this.getStoreList()
      this.getSelectStore()
    },
    getSelectStore() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GETS(this.selectStoreOrder).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.selectStoreData = res.data.Data.Rows
            this.selectStoreTotal = res.data.Data.Count
          }
          this.$store.commit('SET_BTN_LOADING', false)
        }
      )
    },
    // 选择门店需求单
    selectStoreChange(row) {
      this.selectStoreObj = row
    },
    // 关闭选择门店需求单
    closeSelectStore() {
      this.selectStoreOrder = {
        StorechterId: '0',
        RequireCode: '',
        OrderBy: 0,
        State: StyleRequireOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      this.$refs['selectStyle'].resetFields()
      this.storeStyleVisible = false
      this.selectStoreObj = {}
    },
    // 确定创建需求单
    confirmSelectStore() {
      const para = {
        PurchaseId: this.parameters.PurchaseId,
        RequireId: this.selectStoreObj.RequireId
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_SELECTREQUIRECREATE(para).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '成功提单',
              type: 'success'
            })
            this.getItems()
            this.closeSelectStore()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        }
      )
    },
    // 订货单商品数据分页
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getItems()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getItems()
    },
    // 选择门店款式需求单数据分页
    storeStyleCurrent(val) {
      // 切换当前页
      this.selectStoreOrder.PageIndex = val
      this.getSelectStore()
    },
    storeStyleSize(val) {
      // 切换每页显示条数
      this.selectStoreOrder.PageIndex = 1
      this.selectStoreOrder.PageSize = val
      this.getSelectStore()
    },
    // 添加款式
    selectGoodsCurrentChange(val) {
      // 切换当前页
      this.selectGoods.PageIndex = val
      this.getSelectGoods()
    },
    selectGoodSizeChange(val) {
      // 切换每页显示条数
      this.selectGoods.PageIndex = 1
      this.selectGoods.PageSize = val
      this.getSelectGoods()
    },
    // 点击上传图片按钮
    rowUpload(r, i) {
      if (this.imgUploading) {
        this.$message.error('还有正在上传的图片，请稍后再操作！')
        return
      }
      document.getElementById('imgUploaderInput').click()
      this.activeImgRow = r
      this.activeImgIndex = i
    },
    uploadChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function() {
        return function(e) {
          const isLt500K = e.total / 1024 < 500
          if (
            this.result.indexOf('image/jpeg') === -1 &&
            this.result.indexOf('image/png') === -1 &&
            this.result.indexOf('image/jpg') === -1
          ) {
            vm.$message.error('请上传正确文件，支持图片格式为JPG/JPEG/PNG')
            return false
          }
          if (!isLt500K) {
            vm.$message.error('上传图片大小不能超过 500KB!')
            return false
          }
          vm.cropperVisible = true
          vm.cropperUrl = this.result
          vm.imgSize = {
            width: 400,
            height: 400,
            type: 'goods'
          }
          document.getElementById('imgUploaderInput').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    expandRow(val) {
      this.expandRows = val
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取品类
    getCategory() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.category = res.data.Data.Rows
        }
      })
    },
    // 获取门店下拉
    getStoreList() {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storeList = res.data.Data.Rows
        }
      })
    },
    // 获取供应商下拉
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierList = res.data.Data.Rows.filter(item => {
            if (item.State == YNStatus.Yes) {
              return item
            }
          })
        }
      })
    },
    // 提交审核
    orderSubmit() {
      if(this.total && this.tableData.ItemQty <= 0) {
        return this.$message.error('请输入正确的数量后提交审核')
      }
      if (this.tableData.ItemQty == 0) {
        return this.$message.error('请添加款式后再提交审核')
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_WAIT({
        PurchaseId: this.parameters.PurchaseId,
        CheckNote: ''
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交审核成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push('/purchase/orderManagement/index')
          }, 1000)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
    // handleChange(value) {
    //   console.log(value)
    // },
    // addRowVisible() {
    //   this.addVisible = true
    // },
    // copyRowVisible() {
    //   this.copyVisible = true
    // },
  },
  mounted() {
    this.parameters.PurchaseId = Number(this.$route.query.id)
    this.getData()
    this.getItems()
    this.getKind()
    this.getCategory()
    this.getSupplierList()
    this.$store.dispatch('GET_SETTLE_DATE')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.content {
  .title {
    font-size: 14px;
    padding: 10px 15px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #777777;
    font-weight: 600;
    background: #f5f5f5;
    position: relative;
  }
}
.mb {
  margin-bottom: 15px;
}

.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.gesture {
  width: 20px;
  height: 27px;
  cursor: pointer;
  padding-top: 8px;
  color: #999;
  margin-top: 10px;
}
.el-back {
  position: absolute;
  width: 50px;
  top: 0;
  height: 35px;
  right: 25px;
  z-index: 10;
}
.des {
  font-size: 12px;
  color: #bbb;
  margin-left: 10px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
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
.end-right {
  color: #999;
  float: right;
}
</style>

