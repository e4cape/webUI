<template>
  <el-row>
    <div v-loading="$store.getters.tb_loading">
      <div class="panel-tag">
        <span>编辑款式需求单({{detail.KindTypeEv}})</span>
        <el-button name="btnEdit" @click="openDemandList" class="el-back" type="text">修改</el-button>
      </div>
      <div class="details-info-table">
        <table cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">单号</td>
              <td>{{detail.RequireCode}}</td>
              <td class="tit">创建</td>
              <td>{{detail.CreateUser}}&nbsp;&nbsp;{{ detail.CreateTime | filterDateTime}}</td>
              <td class="tit">审核</td>
              <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
              <td v-else>-</td>
            </tr>
            <tr>
              <td class="tit">业务日期</td>
              <td>{{detail.ActualDate | filterDate}}</td>
              <td class="tit">期望到货日期</td>
              <td colspan="3">{{detail.ForwdDate | filterDate}}</td>
            </tr>
            <tr>
              <td class="tit">备注</td>
              <td colspan="5">{{detail.Note}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="checkPage-hd">
        <el-row>
          <el-col :span="12">
            <el-button @click="opemSelectGoods('添加款式')" type="primary" name="addStyle">添加款式</el-button>
          </el-col>
          <el-col :span="12" class="tr" style="padding-right: 10px;">
            <span class="detail-info-num-item">
              数量：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
          </el-col>
        </el-row>
        <!-- <el-button
          type="primary"
          @click="importPurchaseDialog = true"
          name="btnImportant">
          按模板导入
        </el-button>
        <el-button
          type="primary"
          @click="importSmartDialog = true"
          name="btnSmartImport">
          智能导入
        </el-button>-->
      </div>
      <el-table
        :data="data"
        ref="halfTable"
        element-loading-text="拼命加载中"
        highlight-current-row
        class="m-b-10 edit-table"
        v-scrollshow="handelScrollshow"
        :row-class-name="setEditRow"
        height="600"
        v-loading="tableLoading"
      >
        <el-table-column label="操作" width="100" fixed>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
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
                @click="deleteShow(scope)"
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
        <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
        <el-table-column label="款式" width="200" show-overflow-tooltip fixed>
          <template slot="header"><span class="red">*</span>款式</template>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
                <div class="fl item-img" slot="reference">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5 butHand">
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
                <i
                  slot="suffix"
                  class="el-icon-more gesture fl"
                  @click="opemSelectGoods('选择款式',scope.row, scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="图片" width="50">
          <template slot-scope="scope">
            <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" style="width: 30px; height: 30px;">
          </template>
        </el-table-column>
        <el-table-column label="款号">
          <template slot="header"><span class="red">*</span>款号</template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.StyleCode" @change="handleFocus(scope.row)" disabled>
              <i
                slot="suffix"
                class="el-icon-more gesture"
                @click="opemSelectGoods('选择款式',scope.row, scope.$index)"
              ></i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="StyleName" label="款式名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.StyleName"
              @focus="handleFocus(scope.row)"
              disabled
              :controls="false"
            ></el-input>
          </template>
        </el-table-column> -->
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
                <el-option
                  v-for="(item, index) in scope.row.GoldWeights.split(',',scope.row.GoldWeights.split(',').length - 1)"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
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
                <el-option
                  v-for="(item, index) in scope.row.StoneWeights.split(',',scope.row.StoneWeights.split(',').length - 1)"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
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
                <el-option
                  v-for="(item, index) in scope.row.StoneColors.split(',',scope.row.StoneColors.split(',').length - 1)"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
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
                <el-option
                  v-for="(item, index) in scope.row.StoneClaritys.split(',',scope.row.StoneClaritys.split(',').length - 1)"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
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
                <el-option
                  v-for="(item, index) in scope.row.Sizes.split(',',scope.row.Sizes.split(',').length - 1)"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip>
          <template slot="header"><span class="red">*</span>数量</template>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input
              v-model="scope.row.Quantity"
              @focus="handleFocus(scope.row)"
              :maxlength="9"
            ></el-input>
            <!-- <el-input name="Quantity" v-model="scope.row.Quantity" @keyup.native="scope.row.Quantity = toFixed(scope.row.Quantity, 0)" @focus="handleFocus(scope.row)"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
            <el-input v-model="scope.row.Note" @focus="handleFocus(scope.row)" :maxlength="200"></el-input>
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
      <el-row>
        <el-button
          v-if="isSelectd"
          @click="saveRows"
          name="btnsubmitAudit"
          type="primary"
          :loading="$store.getters.is_loading"
        >保存</el-button>
        <el-button
          v-if="(detail.State == orderBasicState.Draft || detail.State == orderBasicState.Reject) && !isSelectd"
          name="btnSubmit"
          type="primary"
          @click="submit"
          :loading="$store.getters.is_loading"
        >提交审核</el-button>
        <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
      </el-row>
      <!-- 修改款式需求单 -->
      <demand-List
        title="修改款式需求单"
        v-if="demandListDialog"
        :demandListVisible="demandListDialog"
        :orderForms="editData"
        @colseDemandList="colseDemList"
        @confirmCreate="newStyleOrder"
      ></demand-List>
      <!-- end 修改款式需求单 -->
      <!-- @module 导入货品 -->
      <el-dialog
        v-if="importPurchaseDialog"
        width="700px"
        class="import-purchase-dialog tc"
        title="导入货品"
        :visible.sync="importPurchaseDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="download-modflie">
          <el-button type="text" @click="downloadTemplate" name="btnGetTemplate">下载模板文件</el-button>
        </div>
        <el-upload
          class="upload-demo"
          drag
          accept=".xls, .xlsx"
          :file-list="fileList"
          :on-success="uploaderSuccess"
          :on-error="uploaderError"
          :on-remove="removeFile"
          :action="$root.settings.DOMAIN_APIS.Merchant + '/api/Upload/File/'"
          ref="uploader"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">1、仅支持.xls和.xlsx的Excel文件。</div>
          <div class="el-upload__tip" slot="tip">2、仅支持Excel文件中第一个表格的数据导入。</div>
          <div class="el-upload__tip" slot="tip">3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</div>
          <div class="el-upload__tip" slot="tip">4、请先下载模板文件填写后再导入。</div>
          <div class="el-upload__tip" slot="tip">5、上传多个文件时，默认使用最后一个文件。</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importData" name="btnImportData">提交</el-button>
          <el-button @click="importPurchaseDialog = false" name="btnCancel">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 导入货品 -->

      <!-- @module 智能导入货品 -->
      <el-dialog
        v-if="importSmartDialog"
        width="700px"
        class="import-purchase-dialog tc"
        title="智能导入货品"
        :visible.sync="importSmartDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="alert-modflie">请选择导入的文件，根据表格标题自动匹配导入：</div>
        <el-upload
          drag
          class="upload-demo"
          accept=".xls, .xlsx"
          :file-list="smartFileList"
          :on-success="smartUploaderSuccess"
          :on-error="uploaderError"
          :on-remove="smartRemoveFile"
          :action="$root.settings.DOMAIN_APIS.Merchant + '/api/Upload/File/'"
          ref="uploader"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">1、仅支持.xls和.xlsx的Excel文件。</div>
          <div class="el-upload__tip" slot="tip">2、仅支持Excel文件中第一个表格的数据导入。</div>
          <div class="el-upload__tip" slot="tip">3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="nextStep" :loading="nextLoading" name="btnNextStep">下一步</el-button>
          <el-button @click="bindGoBack" v-if="goBack" name="btnBindGoBack">返回</el-button>
          <el-button @click="importSmartDialog = false" name="btnImportSmart">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 智能导入货品 -->
      <!-- @module 智能导入货品 -->
      <el-dialog
        v-if="matchupDialog"
        title="智能导入货品"
        style="height: 100%; overflow: hidden;"
        width="900px"
        :visible.sync="matchupDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="matchup-title">
          <span>请选择数据对应关系</span>
          <div class="matchup-selects">
            <!-- START 保存到我的模板 -->
            <el-popover
              name="saveMyself"
              ref="saveMyself"
              placement="bottom-end"
              width="320"
              v-model="visible2"
            >
              <div class="popover-header">
                <span class="title">模板名称：</span>
                <span>（10个字以内）</span>
              </div>
              <el-input
                style="margin: 10px auto;"
                v-model="templetName"
                @keyup.enter.native="saveMyselfModle"
                :maxlength="10"
                name="templetName"
              ></el-input>
              <div style="text-align: center;">
                <el-button
                  type="primary"
                  :loading="createTempLoading"
                  @click="saveMyselfModle"
                  name="btnSaveMyselfModle"
                >保存</el-button>
                <el-button type="text" @click="visible2 = false" name="btnCancel">取消</el-button>
              </div>
              <el-button
                slot="reference"
                style="width: 120px;"
                type="primary"
                name="btnSaveTemplate"
              >保存到我的模板</el-button>
            </el-popover>
            <!-- End 保存到我的模板 -->
            <el-dropdown class="multi-operation" @command="multiAudit" name="btnMultiAudit">
              <el-button>
                我的模板
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu v-if="selfList.length" slot="dropdown">
                <el-dropdown-item
                  :key="index"
                  v-for="(item,index) in selfList"
                  :command="item.TempletId"
                >
                  {{item.TempletName}}
                  <i
                    name="deleteChildren"
                    class="el-icon-error el-icon--right"
                    @click.stop="deleteChildren(item.TempletId)"
                  ></i>
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else slot="dropdown">
                <el-dropdown-item command="nodata">暂无数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 暂时隐藏 -->
            <!-- <el-dropdown class="multi-operation" @command="multiAudit">
              <el-button >
                系统模板<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu v-if="systemList.length" slot="dropdown">
                <el-dropdown-item  :key="index" v-for="(item,index) in systemList" :command="item.TempletId">
                  {{item.TempletName}}
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else slot="dropdown">
                <el-dropdown-item command="nodata">
                  暂无数据
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <!-- 暂时隐藏 -->

            <!-- START 什么是模板 -->
            <el-popover ref="whatTemp" placement="bottom-end" width="220" trigger="hover">
              <span class="popver-title">我的模板:</span>
              <span>将数据对应关系保存到模板，下次选择同样格式的excel文件，通过选择模板自动匹配数据对应关系。</span>
              <br>
              <span class="popver-title">系统模板：</span>
              <span>从其他ERP导入的快捷通道，自动匹配其他ERP导出的货品数据。</span>
              <el-button slot="reference" type="text">什么是模板？</el-button>
            </el-popover>
            <!-- End 什么是模板 -->
          </div>
        </div>
        <el-table
          :data="smartTableData"
          v-if="smartTableData.length"
          v-loading="smartTableLoading"
          border
        >
          <el-table-column prop="AttributeName" label="系统货品属性" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="red">{{scope.row.IsRequired === YNStatus.Yes ? '*' : ''}}</span>
              <span>{{scope.row.StoneName + scope.row.AttributeName}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" prop="ExcelName" label="Excel列">
            <template slot-scope="scope">
              <el-select
                filterable
                v-model="scope.row.ExcelName"
                style="width: 160px;"
                name="excelName"
              >
                <el-option label="空" value></el-option>
                <el-option
                  v-for="(item,index) in xlsSelectList"
                  :label="item"
                  :key="index"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            prop="DefaultValue"
            :render-header="defaultHeader"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="scope.row.AttributeField == 'StoreBarCode'"></template>
              <template v-else-if="scope.row.AttributeType === settingAttributeTypes.TextOfTextual">
                <el-input
                  style="width: 80%;"
                  v-model="scope.row.DefaultValue"
                  :maxlength="50"
                  @keyup.native="scope.row.DefaultValue = scope.row.DefaultValue.replace(/(^\s*)|(\s*$)/g, '')"
                  name="defaultValue"
                ></el-input>
              </template>
              <template v-else-if="scope.row.AttributeType !== settingAttributeTypes.SelectOfEnums">
                <el-input
                  name="defaultValue"
                  style="width: 80%;"
                  v-model="scope.row.DefaultValue"
                  :maxlength="scope.row.AttributeType === settingAttributeTypes.TextOfInteger ? 8 : scope.row.AttributeType === settingAttributeTypes.TextOfDecimal ? 10 : 50"
                  @keyup.native="smartInputChange(scope.row)"
                ></el-input>
              </template>
              <template v-else>
                <el-select
                  name="defaultValue"
                  style="width: 80%;"
                  v-model="scope.row.DefaultValue"
                  placeholder="请选择"
                  filterable
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <template v-for="(item, index) in enums[scope.row.Enumerate].TypeArray">
                    <el-option
                      :key="index"
                      :label="item.Value"
                      :value="item.KeyId + ''"
                      v-if="item.State !== YNStatus.No"
                    ></el-option>
                  </template>
                </el-select>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            prop="RecallPrice"
            :render-header="cutHeader"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.flg"
                type="text"
                @click="scope.row.flg = true"
                name="btnCutSetting"
              >截取设置</el-button>
              <template v-else>
                <el-input
                  placeholder="分隔符"
                  v-model="scope.row.SplitChar"
                  style="width: 90px;"
                  name="splitChar"
                ></el-input>
                <el-select
                  v-model="scope.row.SplitType"
                  style="width: 90px;"
                  filterable
                  placeholder="截取方式"
                  name="splitType"
                >
                  <el-option label="截取方式" :value="0"></el-option>
                  <el-option label="分隔符前" :value="settingTempletItemSplitTypes.Forward"></el-option>
                  <el-option label="分隔符后" :value="settingTempletItemSplitTypes.Backward"></el-option>
                </el-select>
                <i
                  name="cancelCut"
                  class="el-icon-error el-icon--right"
                  @click.stop="cancelCut(scope.row)"
                ></i>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="intelligentSubmitted" name="btnIntelligentSubmitted">提交</el-button>
          <el-button @click="Reimport" name="btnReimport">重新导入</el-button>
          <el-button @click="matchupDialog = false" name="btnMatchupDialog">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 智能导入货品 -->
      <!-- 增加行数 -->
      <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
        <el-form :model="addLineForm" ref="addLineForm">
          <el-form-item label="行数：" prop="rowsNum">
            <el-input name="rowsNum" v-model="addLineForm.rowsNum" @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)" style="width: 200px"></el-input>
            <span style="color: #999; margin-left: 10px;">(最多50行)</span>
          </el-form-item>
          <!-- <el-form-item label="位置：" prop="local">
            <el-radio-group name="local" v-model="addLineForm.local">
              <el-radio label="1">向下插入</el-radio>
              <el-radio label="2">向上插入</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
          <el-button name="btnClose" @click="closeAddSure">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 增加行数 -->
      <!-- 复制行 -->
      <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
        <el-form :model="copyLineForm" ref="copyLineForm">
          <el-form-item label="行数：">
            <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
            <el-input name="rowsNum" v-model="copyLineForm.rowsNum" @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)" style="width: 200px"></el-input>
            <span style="color: #999; margin-left: 10px;">(最多50行)</span>
          </el-form-item>
          <!-- <el-form-item label="位置：">
            <el-radio-group name="local" v-model="copyLineForm.local">
              <el-radio label="1">向下复制</el-radio>
              <el-radio label="2">
                复制到第
                <el-input-number
                  name="rowsNum"
                  v-model="copyLineForm.current"
                  :controls="false"
                  style="width: 50px"
                ></el-input-number>行
              </el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
          <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 复制行 -->
      <!-- 选择添加款式 -->
      <el-dialog
        :title="selectGoodsTitle"
        :visible.sync="selectGoodsVisible"
        width="1000px"
        v-if="selectGoodsVisible"
      >
        <el-form
          :model="selectGoods"
          ref="selectStyle"
          lable-width="120px"
          class="item-lh-26"
          :inline="true"
        >
          <el-form-item prop="KindTypeEk">
            <el-select
              filterable
              name="KindTypeEk"
              v-model="selectGoods.KindTypeEk"
              placeholder="所有种类"
              @change="getSelectGoods"
            >
              <el-option label="所有种类" :value="0"></el-option>
              <el-option
                v-for="(item,index) in kind"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CategoryTypeEk">
            <el-select
              filterable
              name="CategoryTypeEk"
              v-model="selectGoods.CategoryTypeEk"
              placeholder="所有品类"
              @change="getSelectGoods"
            >
              <el-option label="所有品类" :value="0"></el-option>
              <el-option
                v-for="(item, index) in category"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleCode">
            <el-input
              name="StyleCode"
              v-model="selectGoods.StyleCode"
              :maxlength="50"
              @keyup.enter.native="getSelectGoods"
              placeholder="请输入款号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getSelectGoods"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table
          :data="selectGoodsData"
          @selection-change="expandRow"
          @current-change="selectGoodsChange"
          :highlight-current-row="selectGoodsTitle != '添加款式'"
          v-loading="dialogLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column type="selection" fixed v-if="selectGoodsTitle == '添加款式'"></el-table-column>
          <el-table-column label="款式" min-width="140" show-overflow-tooltip fixed>
            <template slot-scope="scope">
              <div class="gift-info-cell">
                <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl != ''">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
                  <div class="fl item-img" slot="reference">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
                  </div>
                </el-popover>
                <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
                <div v-text="scope.row.StyleName"></div>
                <div v-text="scope.row.StyleCode"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="KindTypeEv"
            label="货品种类"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="创建时间"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
          </el-table-column>
          <el-table-column
            label="新款日期"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{scope.row.UpperTime | filterDate}}</template>
          </el-table-column>
          <el-table-column label="模版来源" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{styleBasicTemplateType.Types[scope.row.TemplateType]}}</template>
          </el-table-column>
        </el-table>
        <pagination
          :pg="selectGoods.PageIndex"
          :size="selectGoods.PageSize"
          :total="selectGoodsTotal"
          @currentChange="selectCurrentChange"
          @sizeChange="selectSizeChange"
        ></pagination>
        <span slot="footer" class="dialog-footer">
          <el-button
            name="confirmAdd"
            type="primary"
            @click="addToSelect(false)"
            v-if="selectGoodsTitle === '添加款式'"
            :disabled="expandRows.length ? false : true"
          >添加</el-button>
          <el-button
            name="confirmAddClose"
            type="primary"
            @click="addAndClose"
            v-if="selectGoodsTitle === '添加款式'"
            :disabled="expandRows.length ? false : true"
          >添加并关闭</el-button>
          <el-button
            name="confirmClick"
            type="primary"
            @click="addAndClose"
            :disabled="selectGoodsObj.StyleId ? false : true"
            v-if="selectGoodsTitle === '选择款式'"
          >确定</el-button>
          <el-button name="confirmClose" @click="closeSelectGoods">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </el-row>
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  SettingEnumeratorEnumeratorType,
  StyleBasicTemplateType,
  StyleRequireOrderBasicState,
  StyleBasicState
} from '@/enums/stocking'
import // SecurityDownloadSourceType
'@/enums/merchant.js'
import {
  STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_DELETE,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GET,
  STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_GETS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_UPDATE,
  STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_CREATE,
  STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_UPDATE,
  STOCKING_API_STYLE_BASIC_GETS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_WAIT,
} from '@/apis/stocking'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'
import pagination from '@/components/pagination'
import demandList from './demandList'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      styleBasicTemplateType: StyleBasicTemplateType,
      orderBasicState: StyleRequireOrderBasicState, // 状态
      detail: {},
      data: [],
      importPurchaseDialog: false,
      importSmartDialog: false,
      parameters: {
        RequireId: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
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
          message: '请输入进货方式',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        }
      },
      fileList: [],
      smartFileList: [],
      nextLoading: false,
      demandListDialog: false, // 修改需求单弹窗
      goBack: false, // 智能导入的返回显示隐藏
      selectGoodsVisible: false, // 选择款式弹窗
      matchupDialog: false,
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
      editData: {
        KindTypeEk: ''
      }, // 修改表单
      kind: [], // 种类
      category: [], // 品类
      dialogLoading: false, // 弹窗加载
      selectGoods: {
        KindTypeEk: 0,
        CategoryTypeEk: 0,
        StyleCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        State: StyleBasicState.Done,
      }, // 款式样式筛选
      selectGoodsData: [], // 款式弹窗数据
      selectGoodsTotal: 0, // 款式总数
      selectGoodsTitle: '', // 款式标题
      selectGoodsObj: {}, // 选择款式数据
      expandRows: [], // 新增款式数据
      selectRows: null, // 选择行数
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
    // 表格懒加载
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    getData() {
      // 入库单明细
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GET({
        RequireId: this.parameters.RequireId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.editData = {
            RequireId: res.data.Data.RequireId,
            KindTypeEk: res.data.Data.KindTypeEk,
            ActualDate: res.data.Data.ActualDate,
            ForwdDate: this.fliterTimes(res.data.Data.ForwdDate),
            Note: res.data.Data.Note
          }
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getItems() {
      this.tableLoading = true
      // 货品列表
      STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          if (this.data.length === 0) {
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                GoldWeights: '',
                Sizes: '',
                ItemId: '',
                StoneClaritys: '',
                StoneWeights: '',
                StoneColors: '',
                RequireId: '',
                StyleCode: '',
                StyleName: '',
                GoldWeight: '',
                StoneWeight: '',
                StoneColor: '',
                StoneClarity: '',
                Size: '',
                Quantity: 0,
                Note: '',
                isEdit: false,
                isError: false,
              })
            }
          } else {
            this.data = res.data.Data.Rows.map(item => {
              let newItem = { ...item }
              this.$set(newItem, 'isEdit', false)
              this.$set(newItem, 'isError', false)
              return newItem
            })
          }
          this.total = res.data.Data.Count || 0
        }
        this.tableLoading = false
      })
    },

    fliterTime(val = '') {
      return val.substr(0, 4) === '1900'
        ? '-'
        : dayjs(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    fliterTimes(val = '') {
      return val.substr(0, 4) === '1900'
        ? ''
        : dayjs(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
    },
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
    submit() {
      if(this.detail.ItemQty == 0) {
        return this.$message.error('请添加款式后再提交审核')
      }
      const para = {
        RequireId: this.parameters.RequireId,
        CheckNote: ''
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_WAIT(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交审核成功',
            type: 'success'
          })
          this.$router.back(-1)
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 1024
      let byteCharacters = window.atob(b64Data)
      let byteArrays = []
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize)
        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      let blob = new Blob(byteArrays, {
        type: contentType
      })
      return blob
    },
    downloadTemplate() {
      // STOCKING_API_SETTING_CUSTOMIZED_FIELD_EXPORT({
      // }).then(res => {
      //   if(res.data.Code === 'CORRECT') {
      //     console.log(res)
      //   }
      // })
    },
    uploaderSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.fileList = [
          {
            name: file.name
          }
        ]
        this.filePath = response.Data.Path
      } else {
        this.$message.error(response.Message)
      }
    },
    smartUploaderSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.smartFileList = [
          {
            name: file.name
          }
        ]
        this.smartFilePath = response.Data.Path
      } else {
        this.$message.error(response.Message)
      }
    },
    uploaderError() {
      this.$message('上传失败', 'error')
    },
    smartRemoveFile() {
      this.smartFilePath = ''
      this.smartFileList = []
    },
    removeFile() {
      this.filePath = ''
      this.fileList = []
    },
    listenEditDialog(form, flag) {
      if (flag) {
        this.detail = Object.assign(this.detail, form)
      } else {
        this.editForm = Object.assign({}, this.detail)
      }
      this.editDialog = false
    },
    // nextStep() {
    //   // 下一步
    //   if (!this.smartFileList.length) {
    //     this.$message.error('请先上传文件！')
    //   } else {
    //     this.nextLoading = true
    //     this.smartTableLoading = true
    //     this.getTemplateDetail(() => {
    //       STOCKING_API_PURCHASE_EXCELCOLUMNLIST({
    //         filePath: this.smartFilePath
    //       })
    //         .then(res => {
    //           this.smartTableLoading = false
    //           this.nextLoading = false
    //           if (res.data.Code === 'CORRECT') {
    //             this.initExcelName(res.data.Data)
    //             this.importSmartDialog = false
    //             this.matchupDialog = true
    //             this.getTempletBasicList()
    //           } else {
    //             this.$message.error(res.data.Message)
    //           }
    //         })
    //         .catch(() => {
    //           this.nextLoading = false
    //         })
    //     })
    //   }
    // },
    bindGoBack() {
      this.goBack = false
      this.matchupDialog = true
      this.importSmartDialog = false
    },
    Reimport() {
      // 重新导入
      this.matchupDialog = false
      this.smartFileList = []
      this.importSmartDialog = true
      this.goBack = true
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row ? row : oldRow
      this.isSelectd = true
      let api
      if (oldRow) {
        if (row === null) {
          return
        }
        if (oldRow.StyleCode === '') {
          return this.$message.error('请选择款号')
        }
        if (oldRow.Quantity === '') {
          return this.$message.error('请输入数量')
        }
        if (!/(^[1-9]\d*$)/.test(oldRow.Quantity)) {
          return this.$message.error('请输入正确数量')
        }
        const para = {
          RequireId: this.parameters.RequireId,
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
          KindTypeEk: oldRow.KindTypeEk,
          KindTypeEv: oldRow.KindTypeEv,
          Quantity: Number(oldRow.Quantity),
          ReferPrice: Number(this.$root.toInt(oldRow.ReferPrice)),
          Note: oldRow.Note,
        }
        if (!oldRow.ItemId) {
          api = STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_CREATE
        } else {
          api = STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_UPDATE
        }
        api(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            oldRow.isNew = false
            if(!oldRow.ItemId) {
              oldRow.ItemId = res.data.Data
            }
            setTimeout(() => {
              this.getData()
            }, 500)
          }
        })
      }
    },
    async saveRows() {
      // if (this.currentRow.StyleCode === '') {
      //   return this.$message.error('请选择款号')
      // }
      // if (this.currentRow.Quantity === '') {
      //   return this.$message.error('请输入数量')
      // }
      // if (!/(^[1-9]\d*$)/.test(this.currentRow.Quantity)) {
      //   return this.$message.error('请输入正确数量')
      // }
      // let api
      // let para = {
      //   RequireId: this.parameters.RequireId,
      //   ItemId: this.currentRow.ItemId,
      //   ImageUrl: this.currentRow.ImageUrl,
      //   StyleCode: this.currentRow.StyleCode,
      //   StyleId: this.currentRow.StyleId,
      //   StyleName: this.currentRow.StyleName,
      //   GoldWeight: this.currentRow.GoldWeight,
      //   StoneWeight: this.currentRow.StoneWeight,
      //   StoneColor: this.currentRow.StoneColor,
      //   StoneClarity: this.currentRow.StoneClarity,
      //   Size: this.currentRow.Size,
      //   KindTypeEk: this.currentRow.KindTypeEk,
      //   KindTypeEv: this.currentRow.KindTypeEv,
      //   Quantity: Number(this.currentRow.Quantity),
      //   ReferPrice: Number(this.$root.toInt(this.currentRow.ReferPrice)),
      //   Note: this.currentRow.Note,
      // }
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
          if (this.data[i].Quantity == '' || !/(^[1-9]\d*$)/.test(this.data[i].Quantity)) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：请输入正确数量<br>`)
            continue
          }
          if (this.data[i].isEdit || this.data[i].isError) {
            let res
            let param = { ...this.data[i] }
            param.Quantity = Number(this.data[i].Quantity)
            param.ReferPrice = this.$root.toInt(this.data[i].ReferPrice)
            param.RequireId = this.parameters.RequireId
            if (!this.data[i].ItemId) {
              res = await STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_CREATE(param)
            } else {
              res = await STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_UPDATE(param)
            }
            if(res.data.Code === 'CORRECT') {
              this.data[i].isEdit = false
              if (!this.data[i].ItemId) {
                this.$set(this.data[i], 'ItemId', res.data.Data)
              }
            } else {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
            }
            // api(para).then(res => {
            //   if (res.data.Code === 'CORRECT') {
            //     setTimeout(() => {
            //       this.getData()
            //     }, 500)
            //     this.$message.success('保存成功')
            //     this.isSelectd = false
            //   }
            // })
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
    handleFocus(row) {
      row.isEdit = true
      row.isError = false
      this.isSelectd = true
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
          RequireId: this.parameters.RequireId,
          GoldWeights: '',
          Sizes: '',
          ItemId: '',
          StoneClaritys: '',
          StoneWeights: '',
          StoneColors: '',
          StyleCode: '',
          StyleName: '',
          GoldWeight: '',
          StoneWeight: '',
          StoneColor: '',
          StoneClarity: '',
          Size: '',
          Quantity: 0,
          Note: '',
          isEdit: false,
          isError: false
        })
      }
      this.closeAddSure()
    },
    closeAddSure() {
      this.$refs['addLineForm'].resetFields()
      this.addVisible = false
    },
    deleteShow(scope) {
      if (this.data.length <= 1 && !scope.row.ItemId && this.parameters.PageIndex === 1) {
        this.$message.warning('至少保留一行')
        return false
      }
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (scope.row.ItemId) {
            STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              RequireId: scope.row.RequireId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.data.splice(scope.$index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (this.data.length === 0) {
                  if (this.parameters.PageIndex > 1) {
                    this.parameters.PageIndex = 1
                    this.getItems()
                  } else {
                    this.data.push({
                      RequireId: this.parameters.RequireId,
                      GoldWeights: '',
                      Sizes: '',
                      ItemId: '',
                      StoneClaritys: '',
                      StoneWeights: '',
                      StoneColors: '',
                      StyleCode: '',
                      StyleName: '',
                      GoldWeight: '',
                      StoneWeight: '',
                      StoneColor: '',
                      StoneClarity: '',
                      Size: '',
                      Quantity: 0,
                      Note: '',
                      isEdit: false,
                      isError: false
                    })
                  }
                }
                this.getData()
              }
            })
          } else {
            this.data.splice(scope.$index, 1)
            if (this.data.length === 0) {
              this.parameters.PageIndex = 1
              this.getItems()
            }
          }
          this.isSelectd = false
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
      if ((!Number(this.copyLineForm.current) || parseFloat(this.copyLineForm.current) > this.data.length) && this.copyLineForm.local === '2') {
        this.$message.warning('正确输入行数')
        return false
      }
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
      this.isSelectd = true
      // if(this.handleRow.row.ItemId != '') {
      //   const para = {
      //     ...this.handleRow.row,
      //   }
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.createData(para).then(res => {
      //       if (res.data.Code === 'CORRECT') {
      //         this.data.splice(local, 0, {...this.handleRow.row, ItemId: res.data.Data})
      //       }
      //     })
      //   }
      //   setTimeout(() => {
      //     this.getData()
      //   }, 500)
      // } else {
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.data.splice(local, 0, {
      //       RequireId: this.parameters.RequireId,
      //       GoldWeights: '',
      //       Sizes: '',
      //       ItemId: '',
      //       StoneClaritys: '',
      //       StoneWeights: '',
      //       StoneColors: '',
      //       StyleCode: '',
      //       StyleName: '',
      //       GoldWeight: '',
      //       StoneWeight: '',
      //       StoneColor: '',
      //       StoneClarity: '',
      //       Size: '',
      //       Quantity: 0,
      //       Note: '',
      //       isNew: true
      //     })
      //   }
      // }
      this.colseCopy()
    },
    colseCopy() {
      this.$refs['copyLineForm'].resetFields()
      this.copyVisible = false
    },
    // getStoreAllType() {
    //   this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: YNStatus.Yes, State: 0}).then(res => {
    //     if (res.length === 1) {
    //     }
    //   })
    //   this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    //   this.$store.dispatch('GET_USERS_DROPLIST')
    // },
    toFixed(value, fixed) {
      value = value.toString()
      if (value.length > 1 && /^0/.test(value) && value[1] != '.') {
        // 过滤以00,01,02,03,04,05....开头的东西
        return parseInt(value) || 0
      }
      if (fixed && value === `0.${'0'.repeat(fixed)}`) {
        // 保留两位小数，输入0.00就自动变成0
        return 0
      }
      if (value) {
        if (fixed) {
          if (/^\./.test(value)) {
            return '0.'
          }
          if (value.split('.').length > 2) {
            return `${parseInt(value.split('.')[0])}.${value.split('.')[1]}` * 1
          }
          return (
            value
              .replace(/[^\d.]*/g, '')
              .replace(
                new RegExp(`([0-9]+.[0-9]{${fixed}})[0-9]*`, 'gim'),
                '$1'
              ) * 1
          )
        }
        return value.replace(/[^\d.]*/g, '').split('.')[0] * 1
      }
      return value * 1
    },
    // 打开修改需求单
    openDemandList() {
      this.demandListDialog = true
    },
    // 关闭需求单
    colseDemList() {
      this.demandListDialog = false
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType,
        IsEnable: YNStatus.Yes
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
    async createData(data) {
      const res = await STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_CREATE(data)
      return res
    },
    // 新建需求单
    newStyleOrder(data) {
      const para = {
        ...data,
        ActualDate: dayjs(data.ActualDate).format('YYYY-MM-DD'),
        ForwdDate:
          (data.ForwdDate == ''||!data.ForwdDate) ? '1900-01-01' : dayjs(data.ForwdDate).format('YYYY-MM-DD')
      }
      const obj = this.kind.find(item => item.Id == data.KindTypeEk)
      para.KindTypeEv = obj.Value
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_UPDATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '修改款式式需求单成功',
            type: 'success'
          })
          this.demandListDialog = false
          this.getData()
        }
      })
    },
    // 打开选择弹窗
    opemSelectGoods(title, data, index) {
      if (data) {
        this.selectRows = index
      }
      this.selectGoodsVisible = true
      this.selectGoodsTitle = title
      this.getSelectGoods()
    },
    // 添加选择款式
    async addToSelect(isColse) {
      if (this.selectGoodsTitle == '选择款式') {
        const obj = {
          ...this.data[this.selectRows],
          ...this.selectGoodsObj,
          RequireId: this.parameters.RequireId,
          Quantity: 1,
          // Size: this.selectGoodsObj.Sizes,
          GoldWeight: '',
          StoneWeight: '',
          StoneColor: '',
          StoneClarity: '',
          Size: '',
          Note: '',
          isEdit: true,
          isError: false,
        }
        this.data.splice(this.selectRows, 1, obj)
        // if (this.data[this.selectRows].ItemId) {
        //   STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_UPDATE(obj).then(res => {
        //     if (res.data.Code === 'CORRECT') {
        //       this.data[this.selectRows] = Object.assign(this.data[this.selectRows], obj)
        //       // this.data.splice(this.selectRows, 1, obj)
        //       if (isColse) {
        //         this.closeSelectGoods()
        //       }
        //       setTimeout(() => {
        //         this.getData()
        //       }, 500)
        //     }
        //   })
        // } else {
        //   this.data[this.selectRows] = Object.assign(this.data[this.selectRows], obj)
        //   // this.data.splice(this.selectRows, 1, obj)
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        if(isColse) {
          this.closeSelectGoods()
        }
        // }
        this.isSelectd = true
      } else {
        this.expandRows.map(item => {
          const obj = {
            ...item,
            RequireId: this.parameters.RequireId,
            Size: '',
            Quantity: 1,
            Note: '',
            isEdit: true,
            isError: false,
          }
          this.data.unshift(obj)
          // this.createData(obj).then(res => {
          //   if(res.data.Code === 'CORRECT') {
          //     obj.ItemId = res.data.Data
          //     this.data.unshift(obj)
          //   }
          // })
        })
        // setTimeout(() => {
        //   this.getData()
        // }, 500)
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
      this.$refs['selectStyle'].resetFields()
      this.selectGoodsVisible = false
      this.selectGoodsTitle = ''
      this.selectRows = null
      this.selectGoodsObj = {}
      this.expandRows = []
    },
    // 获取款式弹窗数据
    getSelectGoods() {
      this.dialogLoading = true
      STOCKING_API_STYLE_BASIC_GETS(this.selectGoods).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.selectGoodsData = res.data.Data.Rows
          this.selectGoodsTotal = res.data.Data.Count
        }
        this.dialogLoading = false
      })
    },
    expandRow(val) {
      this.expandRows = val
    },
    // 选择款式
    selectGoodsChange(row) {
      this.selectGoodsObj = row
    },
    selectCurrentChange(val) {
      // 切换当前页
      this.selectGoods.PageIndex = val
      this.getSelectGoods()
    },
    selectSizeChange(val) {
      // 切换每页显示条数
      this.selectGoods.PageSize = val
      this.selectGoods.PageIndex = 1
      this.getSelectGoods()
    }
  },
  created() {
    // this.getStoreAllType()
  },
  mounted() {
    this.parameters.RequireId = parseInt(this.$route.query.id)
    this.getData()
    this.getItems()
    this.getKind()
    this.getCategory()
  },
  components: {
    pagination,
    demandList
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.gesture {
  width: 20px;
  height: 27px;
  cursor: pointer;
  padding-top: 8px;
  color: #999;
}
.el-input-number--mini {
  width: 100%;
}
.panel-tag {
  position: relative;
  .el-back {
    position: absolute;
    right: 25px;
    z-index: 10;
  }
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
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.red {
  color: red;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
}
</style>
