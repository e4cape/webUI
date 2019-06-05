<template>
  <div class="content" v-loading="uploadImgLoading">
    <!-- @module Panel -->
    <div class="panel goodAdd-warpper">
      <div class="panel-hd">
        <span class="title">添加货品</span>
      </div>
      <div class="panel-bd" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-form :model="form" ref="form" class="purchase-form" :rules="rules" label-width="150px">
          <!-- @module 货品属性表单 -->
          <el-row :gutter="10">
            <el-col :span="18">
              <el-col :span="8" v-for="item in detailData" :key="item.AttributeId">
                <el-form-item :prop="item.FieldEnName" :label="item.FieldCnName + '：'">
                  <template
                    v-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfTextual"
                  >
                    <span v-if="item.FieldEnName.indexOf('Image') > -1" >
                      <span v-if="form[item.FieldEnName] == ''" class="el-button--text" >选择图片</span>
                      <uploadImg
                        :class="form[item.FieldEnName] == '' ? 'imgText' : 'imgLoad'"
                        :uploadImgLoading="uploadImgLoading"
                        @uploadImgLoadingChange="loadingsChange"
                        :Root="$root.filePaths.STOCKING_PURCHASE"
                        :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + form[item.FieldEnName]"
                        :styleObj="styleObj"
                        @uploadSucc="(key) => {uploadSucc(key, form, item.FieldEnName)}"
                      ></uploadImg>
                      
                    </span>
                    <el-input
                      v-else
                      v-model="form[item.FieldEnName]"
                      @blur="form[item.FieldEnName] = form[item.FieldEnName].trim()"
                      :maxlength="50"
                    ></el-input>
                  </template>
                  <template
                    v-else-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
                  >
                    <el-input
                      v-model="form[item.FieldEnName]"
                      @blur="form[item.FieldEnName] = form[item.FieldEnName].trim()"
                      :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                      @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)"
                    ></el-input>
                  </template>
                  <template
                    v-else-if="item.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums"
                  >
                    <el-input
                      v-model="form[item.FieldEnName]"
                      @blur="form[item.FieldEnName] = form[item.FieldEnName].trim()"
                      :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                      @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)"
                    ></el-input>
                  </template>
                  <template v-else>
                    <el-select
                      filterable
                      v-model.trim="form[item.FieldEnName]"
                      placeholder="请选择"
                      @change="selectChange(item.FieldEnName, item.Enums)"
                    >
                      <el-option label="请选择" :value="0"></el-option>
                      <template v-if="item.Enumerate && item.Enumerate != ''">
                        <template v-for="(item2, index2) in item.Enums">
                          <el-option
                            :label="item2.Title"
                            :value="item2.Value"
                            :key="index2"
                            v-if="item2.State === enums.EnableState.Enable || item2.State === 0"
                          ></el-option>
                        </template>
                      </template>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="6">
              <div class="img-uploader" @click="iClick">
                <img
                  src="@/assets/images/upload.jpg"
                  style="width: 100%;height: 100%;"
                  v-if="form.ImageUrl == ''"
                >
                <img
                  :src="$root.settings.DOMAIN_IMG_FILE + form.ImageUrl"
                  alt
                  v-else
                  style="width: 100%;"
                >
                <input
                  name="file"
                  type="file"
                  id="imgUploaderInput"
                  style="display: none;"
                  accept="image/jpg, image/jpeg, image/png"
                  @change="uploadChange"
                >
                <div class="uploadeText btn-link el-button--primary">上传图片</div>
              </div>
            </el-col>
          </el-row>
          <!-- End 货品属性表单 -->

          <!-- @module 主石属性表格 -->
          <div class="stone-box" v-if="stoneData[0].length || stoneData[1].length">
            <div class="stone-hd">
              <i class="icon-list"></i>
              <span class="title">主石</span>
              <span>单位 (重量：克拉 价格：元）</span>
            </div>
            <div class="stone-bd">
              <div
                class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
              >
                <div class="el-table__body-wrapper" style="overflow-x: auto;">
                  <table
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    class="el-table__body"
                    :style="stoneData[0].length < 12 ? 'width: 100%;':''"
                  >
                    <thead>
                      <tr>
                        <th colspan="1" rowspan="1" class="'el-table_1_column_1 is-center is-leaf'">
                          <div class="cell">NO.</div>
                        </th>
                        <th
                          colspan="1"
                          rowspan="1"
                          v-for="(item, index) in stoneData[0]"
                          :key="index"
                          :class="'el-table_1_column_'+ (index + 1) + ' is-center is-leaf'"
                        >
                          <div
                            class="cell"
                            :class="{'normal': item.IsRequired !== enums.YNStatus.Yes}"
                          >
                            <template v-if="item.IsRequired === enums.YNStatus.Yes">
                              <span class="red">*</span>
                              <b>{{item.FieldCnName}}</b>
                            </template>
                            <template v-else>{{item.FieldCnName}}</template>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="el-table__row" v-for="(item, index) in stoneData" :key="index">
                        <td :class="'el-table_'+(index + 1 )+'_column_1 is-center'">
                          <div class="cell">{{index+1}}</div>
                        </td>
                        <td
                          v-for="(item1, index1) in item"
                          :key="index1"
                          :class="'el-table_'+(index + 2 )+'_column_'+(index1 + 2)+' is-center'"
                        >
                          <div class="cell">
                            <el-form-item :prop="item1.FieldEnName">
                              <template
                                v-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfTextual"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  :maxlength="50"
                                  @keyup.native="form[item1.FieldEnName] = form[item1.FieldEnName]"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item1.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  @change="getTotalPrice(item1.FieldEnName)"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template v-else>
                                <el-select
                                  filterable
                                  :prop="form[item1.FieldEnName]"
                                  v-model="form[item1.FieldEnName]"
                                  @change="getTotalPrice(item1.FieldEnName, item1.Enums)"
                                  placeholder="请选择"
                                >
                                  <el-option label="请选择" :value="0"></el-option>
                                  <template v-if="item1.Enumerate && item1.Enumerate != ''">
                                    <template v-for="(item2, index2) in item1.Enums">
                                      <el-option
                                        :label="item2.Title"
                                        :value="item2.Value"
                                        :key="index2"
                                        v-if="item2.State === enums.EnableState.Enable || item2.State === 0"
                                      ></el-option>
                                    </template>
                                  </template>
                                </el-select>
                              </template>
                            </el-form-item>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- End 主石属性表格 -->

          <!-- @module 副石属性表格 -->
          <div
            class="stone-box"
            v-if="sideData[0].length || sideData[1].length || sideData[2].length || sideData[3].length"
          >
            <div class="stone-hd">
              <i class="icon-list"></i>
              <span class="title">副石</span>
              <span>单位 (重量：克拉 价格：元）</span>
            </div>
            <div class="stone-bd">
              <div
                class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
              >
                <div class="el-table__body-wrapper" style="overflow-x: auto;">
                  <table
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    class="el-table__body"
                    :style="sideData[0].length < 12 ? 'width:100%;':''"
                  >
                    <thead>
                      <tr>
                        <th colspan="1" rowspan="1" class="'el-table_1_column_1 is-center is-leaf'">
                          <div class="cell">NO.</div>
                        </th>
                        <th
                          colspan="1"
                          rowspan="1"
                          v-for="(item, index) in sideData[0]"
                          :key="index"
                          :class="'el-table_1_column_'+ (index + 2) + ' is-center is-leaf'"
                        >
                          <div
                            class="cell"
                            :class="{'normal': item.IsRequired !== enums.YNStatus.Yes}"
                          >
                            <template v-if="item.IsRequired === enums.YNStatus.Yes">
                              <span class="red">*</span>
                              <b>{{item1.FieldCnName}}</b>
                            </template>
                            <template v-else>{{item.FieldCnName}}</template>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="el-table__row" v-for="(item, index) in sideData" :key="index">
                        <td :class="'el-table_'+(index + 1 )+'_column_1 is-center'">
                          <div class="cell">{{index+1}}</div>
                        </td>
                        <td
                          v-for="(item1, index1) in item"
                          :key="index1"
                          :class="'el-table_'+(index + 2 )+'_column_'+(index1 + 2)+' is-center'"
                        >
                          <div class="cell">
                            <el-form-item :prop="item1.FieldEnName">
                              <template
                                v-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfTextual"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  :maxlength="50"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item1.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  @change="getTotalPrice(item1.FieldEnName)"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums"
                              >
                                <el-input
                                  v-model="form[item1.FieldEnName]"
                                  @blur="form[item1.FieldEnName] = form[item1.FieldEnName].trim()"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template v-else>
                                <el-select
                                  filterable
                                  :prop="form[item1.FieldEnName]"
                                  v-model.trim="form[item1.FieldEnName]"
                                  @change="getTotalPrice(item1.FieldEnName, item1.Enums)"
                                  placeholder="请选择"
                                >
                                  <el-option label="请选择" :value="0"></el-option>
                                  <template v-if="item1.Enumerate && item1.Enumerate != ''">
                                    <template v-for="(item2, index2) in item1.Enums">
                                      <el-option
                                        :label="item2.Title"
                                        :value="item2.Value"
                                        :key="index2"
                                        v-if="item2.State === enums.EnableState.Enable || item2.State === 0"
                                      ></el-option>
                                    </template>
                                  </template>
                                </el-select>
                              </template>
                            </el-form-item>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- End 副石属性表格 -->
        </el-form>
      </div>
    </div>
    <!-- End panel -->
    <img-cropper
      v-if="cropperVisible"
      :cropperVisible="cropperVisible"
      :imgSize="imgSize"
      :url="cropperUrl"
      @listenCropper="listenCropper"
    ></img-cropper>
    <img-check
      v-if="checkImgVisible"
      :checkImgVisible="checkImgVisible"
      :url="$root.settings.DOMAIN_IMG_FILE + checkImgUrl"
      @listenUrlCheck="checkImgVisible = false"
    ></img-check>
    <!-- @module Buttons -->
    <div class="buttons buttons-large">
      <el-button
        type="primary"
        @click="saveData"
        :loading="$store.getters.is_loading"
        name="btnSaveData"
      >保存</el-button>
      <el-button @click="$router.back(-1)" name="btnCancel">取消</el-button>
    </div>
    <!-- End Buttons -->
  </div>
</template>

<script>
import { YNStatus, EnableState } from '@/enums/common.js'
import { SETTING_STAFF } from '@/configs/filePaths.js'
import imgCropper from '@/components/spread/imgCropper'
import imgCheck from '@/views/spread/goods/imgCheck'
import { COMMON_API_IMAGE_UPLOAD64TOOSS } from '@/apis/common'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
  StonePolish,
  StoneSym,
  AppropType,
  WholesaleType,
  RetailType,
  StoneCut,
  StoneClarity,
  StoneColor,
  GiftType,
  GoodsType
} from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_STYLE_BASIC_REQ,
  STOCKING_API_SETTING_DIAMOND_COST_GET
} from '@/apis/stocking.js'
import uploadImg from '@/components/common/uploadImg.vue'

export default {
  props: {
    OrderType: Number,
    LargeType: Number,
    KindTypeEk: Number,
    SmallType: Number
  },
  data() {
    return {
      SETTING_STAFF,
      purchaseId: '',
      form: {
        ImageUrl: ''
      },
      allData: [], // 所有数据
      detailData: [], // 基础信息
      stoneData: [[], []], // 主石信息
      sideData: [[], [], [], [], []], // 副石信息
      enums: {
        GoodsType,
        EnableState,
        YNStatus,
        RetailType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        StoneSym,
        SettingCustomizedFieldType,
        SettingCustomizedFieldSmallType,
        // UploadFileType,
        PaymentType: {},
        KindType: {},
        GoldType: {},
        CategoryType: {},
        MaterialType: {},
        SeriesType: {},
        StoneClassType: {},
        LargeClassType: {},
        SmallClassType: {},
        FinanceClassType: {},
        ProcessType: {},
        PriceType: {},
        FeeType: {},
        AppropType,
        WholesaleType
      },
      rules: {},
      checkImgVisible: false,
      cropperVisible: false,
      uploadImgLoading: false,
      styleObj: {
        width: '70px',
        height: '70px',
        lineHeight: '70px',
        margin: '0'
      }
    }
  },
  components: {
    imgCropper,
    imgCheck,
    uploadImg
  },
  methods: {
    loadingsChange(val) {
      this.uploadImgLoading = val
    },
    // 图片上传成功
    uploadSucc(Key, row, name) {
      // this.form.ImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.$set(row, name, Key)
      // this.conForm.ImageUrl = Key
    },
    listenCropper(files) {
      this.cropperVisible = false
      this.uploadImgLoading = true
      const param = {
        Base64Str: files,
        Root: this.$root.filePaths.COLLEGE_INFAST
      }
      COMMON_API_IMAGE_UPLOAD64TOOSS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form.ImageUrl = res.data.Data.Key
        }
        this.uploadImgLoading = false
        this.cropperVisible = false
      })
    },
    getForm() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({
        // LargeType: SettingCustomizedFieldLargeType.Order,
        SmallType: 0,
        OrderType: this.OrderType,
        // KindTypeEk: this.KindTypeEk
        LargeType: 3,
        KindTypeEk: this.KindTypeEk,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data.Rows) {
            this.$confirm('当前货品没有自定义类型', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.back(-1)
              })
              .catch(() => {
                this.$router.back(-1)
              })
          }
          this.allData = res.data.Data.Rows
          res.data.Data.Rows &&
            res.data.Data.Rows.forEach(item => {
              if (item.IsEnable === this.enums.YNStatus.Yes) {
                // 添加验证信息
                let rule = [
                  {
                    required: item.IsRequired === this.enums.YNStatus.Yes,
                    trigger: 'change,blur',
                    validator: (rule, value, callback) => {
                      if (item.IsRequired === this.enums.YNStatus.Yes) {
                        if (
                          item.FieldType ===
                          this.enums.SettingCustomizedFieldType.SelectOfEnums
                        ) {
                          if (value === 0) {
                            callback(new Error('请选择' + item.FieldCnName))
                          }
                        } else if (value === '') {
                          callback(new Error('请填写' + item.FieldCnName))
                        }
                      } else if (
                        value &&
                        item.FieldType ===
                          this.enums.SettingCustomizedFieldType.TextOfInteger &&
                        !/^\d+$/.test(value) &&
                        value !== '0'
                      ) {
                        callback(new Error(item.FieldCnName + '必须为整型数字'))
                      } else if (
                        value &&
                        item.FieldType ===
                          this.enums.SettingCustomizedFieldType.TextOfDecimal &&
                        !/^(\d+|\d+.\d+)$/.test(value) &&
                        value !== '0'
                      ) {
                        callback(new Error(item.FieldCnName + '必须为数字'))
                      } else if (
                        value &&
                        item.FieldType ===
                          this.enums.SettingCustomizedFieldType.TextOfPercent &&
                        !/^0\.[1-9]+$/.test(value) &&
                        value !== '1' &&
                        value !== '0'
                      ) {
                        callback(new Error('请输入0-1的小数'))
                      }
                      callback()
                    }
                  }
                ]
                switch (item.SmallType) {
                  case this.enums.SettingCustomizedFieldSmallType.Basic:
                    item.index = this.detailData.length
                    // 添加表单
                    this.$set(
                      this.form,
                      item.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item.FieldEnName] = rule
                    this.detailData.push(item)
                    break
                  case this.enums.SettingCustomizedFieldSmallType.Part:
                    item.index = this.detailData.length
                    // 添加表单
                    this.$set(
                      this.form,
                      item.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item.FieldEnName] = rule
                    this.detailData.push(item)
                    break
                  case this.enums.SettingCustomizedFieldSmallType.MainStone: {
                    item.index = this.stoneData.length
                    let item1 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item1.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item1.FieldEnName] = rule
                    if (item1.FieldEnName.indexOf('1') == 5) {
                      item1.FieldCnName = item1.FieldCnName.substr(5)
                      this.stoneData[0].push(item1)
                    }

                    let item2 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item2.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item2.FieldEnName] = rule
                    if (item2.FieldEnName.indexOf('2') == 5) {
                      item2.FieldCnName = item2.FieldCnName.substr(5)
                      this.stoneData[1].push(item2)
                    }
                    break
                  }
                  case this.enums.SettingCustomizedFieldSmallType.SlaveStone: {
                    item.index = this.sideData.length
                    let item3 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item3.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item3.FieldEnName] = rule
                    if (item3.FieldEnName.indexOf('3') == 5) {
                      item3.FieldCnName = item3.FieldCnName.substr(5)
                      this.sideData[0].push(item3)
                    }

                    let item4 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item4.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item4.FieldEnName] = rule
                    if (item4.FieldEnName.indexOf('4') == 5) {
                      item4.FieldCnName = item4.FieldCnName.substr(5)
                      this.sideData[1].push(item4)
                    }

                    let item5 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item5.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item5.FieldEnName] = rule
                    if (item5.FieldEnName.indexOf('5') == 5) {
                      item5.FieldCnName = item5.FieldCnName.substr(5)
                      this.sideData[2].push(item5)
                    }

                    let item6 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item6.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item6.FieldEnName] = rule
                    if (item6.FieldEnName.indexOf('6') == 5) {
                      item6.FieldCnName = item6.FieldCnName.substr(5)
                      this.sideData[3].push(item6)
                    }

                    let item7 = Object.assign({}, item)
                    // 添加表单
                    this.$set(
                      this.form,
                      item7.FieldEnName,
                      item.FieldType == SettingCustomizedFieldType.SelectOfEnums
                        ? 0
                        : ''
                    )
                    this.rules[item7.FieldEnName] = rule
                    if (item7.FieldEnName.indexOf('7') == 5) {
                      item7.FieldCnName = item7.FieldCnName.substr(5)
                      this.sideData[4].push(item7)
                    }
                    break
                  }
                  default:
                    break
                }
              }
            })
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    saveData() {
      let form = { ...this.form }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.allData.map(item => {
            if (
              item.Precision > 0 ||
              item.FieldType == SettingCustomizedFieldType.TextOfPercent
            ) {
              form[item.FieldEnName] = this.$root.toInt(form[item.FieldEnName])
            } else if (
              item.FieldType == SettingCustomizedFieldType.TextOfDecimal ||
              item.FieldType == SettingCustomizedFieldType.TextOfInteger
            ) {
              form[item.FieldEnName] = Number(form[item.FieldEnName])
            }
          })
          if (form.StyleCode) {
            STOCKING_API_STYLE_BASIC_REQ({ StyleCode: form.StyleCode }).then(
              res => {
                if (res.data.Code == 'CORRECT') {
                  form.StyleId = res.data.Data.StyleId
                  this.$emit('saveData', form)
                }
              }
            )
          } else {
            form.StyleId = 0
            this.$emit('saveData', form)
          }
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    inputChange(name, type) {
      if (type === SettingCustomizedFieldType.TextOfInteger) {
        if (this.form[name] == '' || !/^\d+$/.test(this.form[name])) {
          this.form[name] = 0
        } else {
          this.form[name] = parseInt(this.form[name])
        }
      } else if (type === SettingCustomizedFieldType.TextOfPercent) {
        if (
          this.form[name] == '' ||
          this.form[name] > 1 ||
          this.form[name] < 0 ||
          !/^0\.[1-9]+$/.test(this.form[name])
        ) {
          this.form[name] = 0
        } else {
          this.form[name] = parseFloat(this.form[name])
        }
      } else if (type === SettingCustomizedFieldType.TextOfDecimal) {
        if (this.form[name] == '' || !/^(\d+|\d+.\d+)$/.test(this.form[name])) {
          this.form[name] = 0
        } else {
          this.form[name] = parseInt(this.form[name])
        }
      }
    },
    iClick() {
      document.getElementById('imgUploaderInput').click()
    },
    uploadChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function() {
        return function(e) {
          const isLt2M = e.total / 1024 / 1024 < 2
          if (!isLt2M) {
            vm.$message.error('上传图片大小不能超过 2MB!')
            return false
          }
          if (
            this.result.indexOf('image/jpeg') === -1 &&
            this.result.indexOf('image/png') === -1 &&
            this.result.indexOf('image/jpg') === -1
          ) {
            vm.$message.error('请上传正确文件')
            return false
          }
          vm.cropperVisible = true
          vm.cropperUrl = this.result
          vm.imgSize = {
            width: 750,
            height: 750,
            type: 'goods'
          }
          document.getElementById('imgUploaderInput').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    selectChange(val, Enums) {
      if (val.indexOf('Ek')) {
        const name = val.substring(0, val.indexOf('Ek')) + 'Ev'
        this.form[name] = Enums.find(i => i.Value === this.form[val])
          ? Enums.find(i => i.Value === this.form[val]).Title
          : ''
      }
    },
    getTotalPrice(val, Enums = []) {
      let i = val.charAt(5)
      if(val == `Stone${i}Color` || val == `Stone${i}Clarity` || val == `Stone${i}Weight`) {
        if (
          this.form[`Stone${i}Color`] &&
          this.form[`Stone${i}Clarity`] &&
          this.form[`Stone${i}Weight`]
        ) {
          STOCKING_API_SETTING_DIAMOND_COST_GET({
            StoneColor: this.form[`Stone${i}Color`],
            StoneClarity: this.form[`Stone${i}Clarity`],
            StoneWeight: this.$root.toInt(this.form[`Stone${i}Weight`])
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.form[`Stone${i}Price6`] = res.data.Data.Price ? this.$root.toFloat(res.data.Data.Price) : ''
            }
          })
        } else {
          if(this.form[`Stone${i}Price6`]) {
            this.form[`Stone${i}Price6`] = ''
          }
        }
      }
      this.selectChange(val, Enums)
    }
  },
  mounted() {
    this.getForm()
  },
  beforeMount() {
    // this.getAllTypes()
  },
  watch: {}
}
</script>
<style lang="scss">
.goodAdd-warpper {
  .el-col-8 {
    overflow: hidden;
  }
  border: none;
  .panel-hd {
    .title {
      color: #777777;
      font-weight: bold;
      line-height: 32px;
    }
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
    border-top: 1px solid #e5e5e5;
  }
  .panel-bd {
    padding-left: 10px;
  }
}
.stone-box {
  .stone-hd {
    height: 42px;
    line-height: 42px;
    i {
      color: #399fe5;
    }
    span {
      color: #777777;
    }
    .title {
      font-weight: bold;
      color: #333;
      margin-left: 10px;
      margin-right: 16px;
    }
  }
  .stone-bd {
    .el-table td,
    .el-table th {
      padding: 2px 0;
      border: none;
      font-size: 12px;
      .el-input {
        width: 100px;
      }
    }
  }

  .el-form-item {
    margin: 0;
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__error {
      position: relative;
    }
  }
}
</style>

<style lang="scss" scoped>
.purchase-form {
  padding: 0 10px;
  height: auto;
  border-bottom: 0;
  margin: 25px 0 15px;
}

.buttons {
  padding: 0 0 0 20px;
}

.el-table {
  border-left: none;
  border-right: none;
  overflow-x: auto;
  table {
    border-collapse: collapse;
    .cell.normal {
      font-weight: 600;
    }
    tr {
      border-bottom: 1px solid #e5e5e5;
    }
    width: auto;
    th:last-child {
      border-right: 0;
    }
    // th:nth-last-child(2) {
    //   border-right: 1px solid #e5e5e5;
    // }
  }
  .cell {
    white-space: nowrap;
    &.normal {
      font-weight: normal;
    }
  }
}
.el-select,
.el-input-number {
  width: 100%;
}
.good-uploader {
  text-align: center;
  img {
    display: block;
    width: 100%;
    margin-bottom: 15px;
  }
}
.img-uploader {
  position: relative;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  width: 200px;
  height: 200px;
  border: #d9d9d9 1px dotted;
  border-radius: 5px;
  &:hover {
    border: #409eff 1px dotted;
  }
  > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
}
.uploadeText {
  position: absolute;
  bottom: -40px;
  width: 100px;
  margin-left: 50px;
  height: 27px;
  line-height: 27px;
  text-align: center;
  cursor: pointer;
}
.imgText {
  width: 83px !important;
  height: 50px !important;
  margin-top: -53px !important;
  opacity: 0;
}
</style>
