<template>
  <div class="content oldGoods-add-box">
    <!-- @module Panel -->
    <div class="panel goodAdd-warpper">
      <div class="panel-hd">
        <span class="title">修改货品</span>
      </div>
      <div class="panel-bd" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-form :model="form" ref="form" class="purchase-form" :rules="rules" label-width="180px">
          <!-- @module 货品属性表单 -->
          <el-row v-if="detailData.length" :gutter="10">
            <el-col>
              <!-- <el-form-item v-if="isOldCode == enums.YNStatus.Yes" :label="'使用原条码：'">
                <el-radio-group  v-model="isOldCode" @change="removeValid">
                  <el-radio :label="enums.YNStatus.Yes">是</el-radio>
                  <el-radio :label="enums.YNStatus.No">否</el-radio>
                </el-radio-group>
                <span>(本店售出的货品，可以使用原条码，货品信息与原条码同步，不可修改)</span>
              </el-form-item> -->
            </el-col>
            <!-- start 旧货属性 -->
            <el-col :span="18">
              <el-col key="processPrice" :span="8">
                <el-form-item :label="'加工费：'">
                  <el-input v-model="form.CraftFee" :maxlength="50" @keyup.native="form.CraftFee = $root.toFixed(form.CraftFee, 2)" name="CraftFee"></el-input>
                </el-form-item>
              </el-col>
              <el-col key="processType" :span="8">
                <el-form-item :label="'加工类型：'">
                  <el-select v-model="form.CraftType" filterable placeholder="请选择" name="carftType">
                    <el-option label="请选择" :value="0"></el-option>
                    <el-option v-for="(item, index) in enums.JunkCraftType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item :label="'旧货编号：'">
                  <el-input v-model="form.JunkCode" :maxlength="50" disabled name="junkCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="'旧货名称：'">
                  <el-input v-model="form.JunkName" :maxlength="50" disabled name="JunkName"></el-input>
                </el-form-item>
              </el-col> -->
              <!-- end 旧货属性 -->
              <el-col :span="8" v-for="item in detailData" :key="item.AttributeId">
                <el-form-item :prop="item.FieldEnName" :label="item.FieldCnName + '：'">
                  <template v-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfTextual">
                    <uploadImg
                      v-if="item.FieldEnName.indexOf('Image') > -1"
                      :uploadImgLoading="uploadImgLoading"
                      :Root="$root.filePaths.COLLEGE_INFAST"
                      :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + form[item.FieldEnName]"
                      :styleObj="styleObj"
                      @uploadSucc="(key) => {uploadSucc(key, form, item.FieldEnName)}"
                    ></uploadImg>
                    <!--  @keyup.native="form[item.FieldEnName] = form[item.FieldEnName].replace(/(^\s*)|(\s*$)/g, '')" -->
                    <el-input v-else v-model="form[item.FieldEnName]" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :maxlength="50" :controls="false"></el-input>
                  </template>
                  <template v-else-if="item.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums">
                    <!--  @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)" -->
                    <el-input v-model="form[item.FieldEnName]" @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"></el-input>
                  </template>
                  <template v-else-if="enums[item.Enumerate] && enums[item.Enumerate].TypeArray">
                    <el-select v-model="form[item.FieldEnName]" @change="getEv(item.FieldEnName, enums[item.Enumerate].TypeArray)" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :prop="form[item.FieldEnName]" placeholder="请选择" :filterable="true">
                      <el-option label="请选择" :value="0"></el-option>
                      <template  v-for="(item1, index1) in enums[item.Enumerate].TypeArray">
                        <el-option :key="index1" :label="item1.Value" :value="parseInt(item1.KeyId)?parseInt(item1.KeyId):parseInt(item1.Id)" v-if="item1.State !== enums.YNStatus.No || parseInt(form[item.FieldEnName]) === parseInt(item1.KeyId)"></el-option>
                      </template>
                    </el-select>
                    <!-- <span>{{JSON.stringify(enums[item.Enumerate])}}-{{item.Enumerate}}</span> -->
                  </template>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="6">
              <div class="good-uploader">
                <uploadImg
                  :uploadImgLoading="uploadImgLoading"
                  :Root="$root.filePaths.COLLEGE_INFAST"
                  :uploadImageUrl="uploadImageUrl"
                  :styleObj="styleObj1"
                  @uploadSucc="uploadSucc1"
                ></uploadImg>
                <span>上传图片</span>
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
              <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper">
                  <table 
                    cellspacing="0" 
                    cellpadding="0" 
                    border="0" 
                    class="el-table__body" 
                    :style="stoneData[0].length < 12 ? 'width: 100%;':''">
                    <thead>
                      <!-- <tr>
                        <th colspan="1" rowspan="1" v-for="(item, index) in stoneData" :key="index" :class="'el-table_1_column_'+ (index + 1) + ' is-leaf'">
                          <div class="cell" :class="{'normal': item.IsRequired !== enums.YNStatus.Yes}">
                            <template v-if="item.IsRequired === enums.YNStatus.Yes">
                              <span class="red">*</span><b>{{item.FieldCnName}}</b>
                            </template>
                            <template v-else>
                              {{item.FieldCnName}}
                            </template>
                          </div>
                        </th>
                      </tr> -->
                      <tr>
                        <th colspan="1" rowspan="1" class="'el-table_1_column_1 is-leaf'">
                          <div class="cell">NO.</div>
                        </th>
                        <th
                          colspan="1"
                          rowspan="1"
                          v-for="(item, index) in stoneData[0]"
                          :key="index"
                          :class="'el-table_1_column_'+ (index + 1) + ' is-leaf'"
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
                      <!-- <tr class="el-table__row" v-for="(item, index) in stoneData" :key="index">
                        <td :class="'el-table_'+(index + 1 )+'_column_'+(index + 1)+''">
                          <div class="cell">
                            <el-form-item :prop="item.FieldEnName">
                              <template v-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfTextual">
                                <el-input v-model="form[item.FieldEnName]"  @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)" :disabled="isOldCode === enums.YNStatus.Yes? true : disableds.indexOf(item.FieldEnName) >= 0" :maxlength="50"></el-input>
                              </template>
                              <template v-else-if="item.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums">
                                <el-input v-model="form[item.FieldEnName]"  @keyup.native="form[item.FieldEnName] = $root.toFixed(form[item.FieldEnName], item.Precision)" :disabled="isOldCode === enums.YNStatus.Yes? true : disableds.indexOf(item.FieldEnName) >= 0" :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"></el-input>
                              </template>
                              <template v-else>
                                <el-select :prop="form[item.FieldEnName]" v-model="form[item.FieldEnName]" :disabled="isOldCode === enums.YNStatus.Yes? true : disableds.indexOf(item.FieldEnName) >= 0" :change="1" placeholder="请选择" :filterable="true">
                                  <el-option label="请选择" :value="0"></el-option>
                                  <el-option v-for="(item2, index2) in enums[item.Enumerate].TypeArray" :key="index2" :label="item2.Value" :value="parseInt(item2.KeyId)?parseInt(item2.KeyId):parseInt(item2.Id)" v-if="item2.State !== enums.YNStatus.No || parseInt(form[item.FieldEnName]) === parseInt(item2.KeyId?item2.KeyId:item2.Id)"></el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </div>
                        </td>
                      </tr> -->
                      <tr class="el-table__row" v-for="(item, index) in stoneData" :key="index">
                        <td :class="'el-table_'+(index + 1 )+'_column_1'">
                          <div class="cell">{{index+1}}</div>
                        </td>
                        <td
                          v-for="(item1, index1) in item"
                          :key="index1"
                          :class="'el-table_'+(index + 2 )+'_column_'+(index1 + 2)+''"
                        >
                          <div class="cell">
                            <el-form-item :prop="item1.FieldEnName">
                              <template
                                v-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfTextual"
                              >
                                <el-input
                                  v-model.trim="form[item1.FieldEnName]"
                                  :maxlength="50"
                                  @keyup.native="form[item1.FieldEnName] = form[item1.FieldEnName]"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item1.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
                              >
                                <el-input
                                  v-model.trim="form[item1.FieldEnName]"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template
                                v-else-if="item1.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums"
                              >
                                <el-input
                                  v-model.trim="form[item1.FieldEnName]"
                                  :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                                  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)"
                                ></el-input>
                              </template>
                              <template v-else>
                                <el-select
                                  v-model.trim="form[item1.FieldEnName]"
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
          <div class="stone-box" v-if="sideData[0].length || sideData[1].length || sideData[2].length || sideData[3].length">
            <div class="stone-hd">
              <i class="icon-list"></i>
              <span class="title">副石</span>
              <span>单位 (重量：克拉 价格：元）</span>
            </div>
            <div class="stone-bd">
              <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper">
                  <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" :style="sideData[0].length < 12 ? 'width:100%;':''">
                    <thead>
                      <tr>
                        <th colspan="1" rowspan="1" class="'el-table_1_column_1 is-leaf'">
                          <div class="cell">NO.</div>
                        </th>
                        <th colspan="1" rowspan="1" v-for="(item, index) in sideData[0]" :key="index" :class="'el-table_1_column_'+ (index + 2) + ' is-leaf'">
                          <div class="cell" :class="{'normal': item.IsRequired !== enums.YNStatus.Yes}">
                            <template v-if="item.IsRequired === enums.YNStatus.Yes">
                              <span class="red">*</span><b>{{item.FieldCnName}}</b>
                            </template>
                            <template v-else>
                              {{item.FieldCnName}}
                            </template>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="el-table__row" v-for="(item, index) in sideData" :key="index">
                        <td :class="'el-table_'+(index + 1 )+'_column_1'">
                          <div class="cell">{{index+1}}</div>
                        </td>
                        <td v-for="(item1, index1) in item" :key="index1" :class="'el-table_'+(index + 2 )+'_column_'+(index1 + 2)+''">
                          <div class="cell">
                            <el-form-item :prop="item1.FieldEnName">
                              <template v-if="item1.FieldType === enums.SettingCustomizedFieldType.TextOfTextual">
                                <!--  @keyup.native="form[item.FieldEnName] = form[item.FieldEnName].replace(/(^\s*)|(\s*$)/g, '')" -->
                                <el-input v-model="form[item1.FieldEnName]" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :maxlength="50"></el-input>
                              </template>
                              <template v-else-if="item1.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums">
                                <!--  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item1.Precision)" -->
                                <el-input v-model="form[item1.FieldEnName]"  @keyup.native="form[item1.FieldEnName] = $root.toFixed(form[item1.FieldEnName], item.Precision)" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :maxlength="item1.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item1.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"></el-input>
                              </template>
                              <template v-else>
                                <el-select :prop="form[item1.FieldEnName]" v-model="form[item1.FieldEnName]" :disabled="disableds.indexOf(item.FieldEnName) >= 0" :change="1" placeholder="请选择" :filterable="true">
                                  <el-option label="请选择" :value="0"></el-option>
                                  <template v-for="(item2, index2) in enums[item1.Enumerate].TypeArray">
                                    <el-option :key="index2" :label="item2.Value" :value="parseInt(item2.KeyId)" v-if="item2.State !== enums.YNStatus.No || parseInt(form[item1.FieldEnName]) === parseInt(item2.KeyId)"></el-option>
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

    <!-- @module Buttons -->
    <div class="buttons">
      <el-button type="primary" @click="saveData" :loading="$store.getters.is_loading" name="btnSaveData">保存</el-button>
      <router-link :to="{path: '/depot/junkChange/edit', query: {id: query.ChangeId}}" name="btnJunkChangeEdit">
        <el-button>
          取消
        </el-button>
      </router-link>
    </div>
    <!-- End Buttons -->
  </div>
</template>

<script>
import {
  GiftType,
  FeeType,
  PriceType,
  RetailType,
  ProcessType,
  StoneColor,
  StoneClarity,
  StoneCut,
  StonePolish,
  StoneSym,
  GoldType,
  CategoryType,
  MaterialType,
  WholesaleType,
  AppropType,
  JunkChangeOrderItemCraftType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  YNStatus,
  EnableState
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_BASIC_GET,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GET,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_CREATE,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_BASIC_GET
  // STOCKING_API_GOODS_DETAIL
  // STOCKING_API_GOODS_STONEDETAIL
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant.js'

import uploadImg from '@/components/common/uploadImg.vue'

export default {
  data() {
    return {
      purchaseId: '',
      form: {},
      query: {
      },
      JunkId: '',
      type: 0,
      isOldCode: 3,
      JunkName: '',
      ChangeId: '',
      detailData: [], // 基础信息
      stoneData: [[],[]], // 主石信息
      sideData: [[], [], [], [],[]], // 副石信息
      disableds: ['Quantity'],
      uploadImgLoading: false,
      uploadImageUrl: '',
      styleObj1: {
        width: '150px',
        height: '150px',
        lineHeight: '150px',
        margin: '0 auto'
      },
      SettingEnumeratorEnumeratorType,
      enums: {
        YNStatus,
        EnableState,
        JunkCraftType: JunkChangeOrderItemCraftType,
        RetailType,
        ProcessType,
        PriceType,
        FeeType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        StoneSym,
        WholesaleType,
        AppropType,
        SettingCustomizedFieldType,
        SettingCustomizedFieldSmallType,
        GoldType,
        CategoryType,
        MaterialType
      },
      CostPrice: 0,
      CraftFee: 0,
      CraftType: 0,
      rules: {
      },
      isUpload: false,
      imgUrl: '',
      isComing: false, // 判断第一进入的时候不去计算成本价（手动修改加工费是去计算）
      styleObj: {
        width: '70px',
        height: '70px',
        lineHeight: '70px',
        margin: '0',
        overflow: 'hidden',
      }
    }
  },
  methods: {
    getJunkDetail() {
      Object.assign(this.form, {
        Quantity: 1
      })
      if(this.$route.query.ItemId){
        // 否则就是编辑旧货
        console.log('this.$route', this.$route, 'this.router', this.$router)
        STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GET({
          ItemId: this.$route.query.ItemId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false) // table loading
          if (res.data.Code === 'CORRECT') {
            // Object.assign(this.form, res.data.Data)
            this.CostPrice = res.data.Data.RecallPrice.toFixed(2)
            this.form = Object.assign({}, this.form, res.data.Data, {
              CategoryType: parseInt(res.data.Data.CategoryType),
              MaterialType: parseInt(res.data.Data.MaterialType),
              GoldType: parseInt(res.data.Data.GoldType),
              GoldWeight: res.data.Data.GoldWeight,
              Weight: res.data.Data.Weight,
              // CostPrice: !res.data.Data.RecallPrice
              //   ? ''
              //   : (Number(res.data.Data.RecallPrice)||0) + (Number(this.form.CraftFee)||0),
              StoneClarity1: res.data.Data.StoneClarity,
              StoneColor1: res.data.Data.StoneColor,
              StoneCut1: res.data.Data.StoneCut,
              StoneWeight1: res.data.Data.StoneWeight,
              // StoreBarCode: '',
              // Quantity: 1
            })
            if (!this.type) {
              this.goodsId = res.data.Data.GoodsId
            }
            this.imgUrl = res.data.Data.ImageUrl || '/default/goods/150x150.jpg'
            this.allData.map(item => {
              if (this.form[item.FieldEnName] === 0 && item.FieldType !== SettingCustomizedFieldType.SelectOfEnums) {
                this.form[item.FieldEnName] = ''
              }
              if (item.Precision > 0 && this.form[item.FieldEnName] != '') {
                this.form[item.FieldEnName] = this.$root.toFloat(this.form[item.FieldEnName], item.Precision)
              }
            })
            this.isComing = true
            this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + this.form.ImageUrl || '/default/goods/150x150.jpg'
            this.form.CraftFee = this.form.CraftFee?this.$root.toFloat(this.form.CraftFee):''
            console.log('this.form2', this.form)
            // this.getGoodId()
          }
        })
      }else{
        this.getGoodId()
      }
    },
    getGoodId() {
      // 获取GoodsId
      STOCKING_API_JUNK_BASIC_GET({
        JunkId: this.JunkId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!this.goodsId) {
            this.goodsId = res.data.Data.GoodsId
          }
          this.isOldCode = res.data.Data.IsOurs
          // this.form = res.data.Data
          this.CostPrice = res.data.Data.RecallPrice.toFixed(2)
          this.imgUrl = res.data.Data.ImageUrl || '/default/goods/150x150.jpg'
          if (res.data.Data.ImageUrl) {
            this.uploadImageUrl =
              this.$root.settings.DOMAIN_IMG_FILE + res.data.Data.ImageUrl
          }
          this.form = Object.assign({}, this.form, res.data.Data, {
            CategoryType: parseInt(res.data.Data.CategoryType),
            MaterialType: parseInt(res.data.Data.MaterialType),
            GoldType: parseInt(res.data.Data.GoldType),
            GoldWeight: res.data.Data.GoldWeight,
            Weight: res.data.Data.Weight,
            CostPrice: !res.data.Data.RecallPrice
              ? ''
              : (Number(res.data.Data.RecallPrice)||0) + (Number(this.form.CraftFee)||0),
            StoneClarity1: res.data.Data.StoneClarity,
            StoneColor1: res.data.Data.StoneColor,
            StoneCut1: res.data.Data.StoneCut,
            StoneWeight1: res.data.Data.StoneWeight,
            // StoreBarCode: '',
            // Quantity: 1
          })
          
          // this.form.CraftFee = this.$root.toFloat(this.form.CraftFee)
          this.form.CraftFee = this.form.CraftFee == 0? '' : this.$root.toFloat(this.form.CraftFee)
          if (res.data.Data.IsOurs === this.enums.YNStatus.Yes && this.goodsId) {
            // 本店 或者 修改
            this.getGoodDetail(res.data.Data)
          } else {
            this.allData.map(item => {
              if (this.form[item.FieldEnName] === 0 && item.FieldType !== SettingCustomizedFieldType.SelectOfEnums) {
                this.form[item.FieldEnName] = ''
              }
              if (item.Precision > 0 && this.form[item.FieldEnName] != '') {
                this.form[item.FieldEnName] = this.$root.toFloat(this.form[item.FieldEnName], item.Precision)
              }
            })
            this.form.ImageUrl = this.imgUrl
            this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + this.form.ImageUrl || '/default/goods/150x150.jpg'
            this.$store.commit('SET_FULL_LOADING', false) // table loading
          }
        }
      })
    },
    getGoodDetail(params) {
      // 获取货物详情
      STOCKING_API_GOODS_BASIC_GET({
        GoodsId: this.goodsId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          res.data.Data.CostPrice = !res.data.Data.CostPrice ? '' : res.data.Data.CostPrice.toFixed(2)
          var json = {
            ImageUrl: '',
            CategoryType: parseInt(params.CategoryType),
            MaterialType: parseInt(params.MaterialType),
            GoldType: parseInt(params.GoldType),
            GoldWeight: params.GoldWeight,
            Weight: params.Weight,
            StoneClarity1: params.StoneClarity,
            StoneColor1: params.StoneColor,
            StoneCut1: params.StoneCut,
            StoneWeight1: params.StoneWeight
          }
          if (!this.type) {
            // 新建(本店的旧货条码不能用原条码)
            json.ImageUrl = this.imgUrl == '/default/goods/150x150.jpg' ? res.data.Data.ImageUrl : this.imgUrl
            Object.assign(this.form, res.data.Data, json, {
              BarCode: '',
              Quantity: 1
            })
          } else {
            // 修改
            json = {
              ImageUrl: '',
            }
            json.ImageUrl = res.data.Data.ImageUrl
            Object.assign(this.form, res.data.Data,json)
          }
          this.allData.map(item => {
            if (this.form[item.FieldEnName] === 0 && item.FieldType !== SettingCustomizedFieldType.SelectOfEnums) {
              this.form[item.FieldEnName] = ''
            }
            if('LabelPrice' == item.FieldEnName){
              console.log(item.FieldEnName, this.form[item.FieldEnName])
            }
            if (item.Precision > 0 && this.form[item.FieldEnName] != '') {
              this.form[item.FieldEnName] = this.$root.toFloat(this.form[item.FieldEnName], item.Precision)
              console.log(item.FieldEnName, this.form[item.FieldEnName], this.form)
            }
          })
          this.form.CostPrice = this.$root.toFloat(Number(this.form.RecallPrice) + Number(this.CraftFee))
          // this.getGoodStone(json)
        }
      })
    },
    // getGoodStone(json) {
    //   // 获取主石信息
    //   STOCKING_API_GOODS_STONEDETAIL({
    //     GoodsId: this.goodsId
    //   }).then(res => {
    //     if (res.data.Code === 'CORRECT') {
    //       Object.assign(this.form, res.data.Data, json)
    //       this.change = true
    //     }
    //     this.$store.commit('SET_FULL_LOADING', false) // table loading
    //   })
    // },
    getForm() {
      // 获取表单格式
      console.log('获取表单格式', this.form)
      // this.$store.commit('SET_FULL_LOADING', true) // table loading
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({
        OrderType: 13,
        LargeType: 3,
        KindTypeEk: this.$route.query.KindTypeEk,
        IsEnable: this.enums.YNStatus.Yes,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allData = res.data.Data.Rows || []
          this.allData.map(item => {
            // if (this.form[item.FieldEnName] === 0 && item.FieldType !== SettingCustomizedFieldType.SelectOfEnums) {
            //   this.form[item.FieldEnName] = ''
            // }
            // if (item.Precision > 0 && this.form[item.FieldEnName] != '') {
            //   this.form[item.FieldEnName] = this.$root.toFloat(this.form[item.FieldEnName], item.Precision)
            // }
            this.form[item.FieldEnName] = this.form[item.FieldEnName]||''
          })
          this.form.CraftFee = 0
          this.form.CraftType = 0
          res.data.Data.Rows&&res.data.Data.Rows.forEach(item => {
            if (item.IsEnable === this.enums.YNStatus.Yes) {
              // 添加验证信息
              let rule = [
                {
                  required: item.IsRequired === this.enums.YNStatus.Yes,
                  trigger: 'change,blur',
                  validator: (rule, value, callback) => {
                    if (item.IsRequired === this.enums.YNStatus.Yes) {
                      if (item.FieldType === this.enums.SettingCustomizedFieldType.SelectOfEnums) {
                        console.log('value', value, item.FieldEnName)
                        if (value === 0||!value) {
                          callback(new Error(
                            '请选择'+ item.FieldCnName
                          ))
                        }
                      } else if (value === '') {
                        callback(
                          new Error(
                            '请填写' + item.FieldCnName
                          )
                        )
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
                      parseInt(value) !== 1 &&
                      parseInt(value) !== 0
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
                  this.rules[item.FieldEnName] = rule
                  this.detailData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.Part:
                  item.index = this.detailData.length
                  this.rules[item.FieldEnName] = rule
                  this.detailData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.MainStone: {
                  item.index = this.stoneData.length
                  let item1 = Object.assign({}, item)
                  this.rules[item1.FieldEnName] = rule
                  if (item1.FieldEnName.indexOf('1') == 5) {
                    item1.FieldCnName = item1.FieldCnName.substr(5)
                    this.stoneData[0].push(item1)
                  }

                  let item2 = Object.assign({}, item)
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
                  this.rules[item3.FieldEnName] = rule
                  if (item3.FieldEnName.indexOf('3') == 5) {
                    item3.FieldCnName = item3.FieldCnName.substr(5)
                    this.sideData[0].push(item3)
                  }

                  let item4 = Object.assign({}, item)
                  this.rules[item4.FieldEnName] = rule
                  if (item4.FieldEnName.indexOf('4') == 5) {
                    item4.FieldCnName = item4.FieldCnName.substr(5)
                    this.sideData[1].push(item4)
                  }

                  let item5 = Object.assign({}, item)
                  this.rules[item5.FieldEnName] = rule
                  if (item5.FieldEnName.indexOf('5') == 5) {
                    item5.FieldCnName = item5.FieldCnName.substr(5)
                    this.sideData[2].push(item5)
                  }

                  let item6 = Object.assign({}, item)
                  this.rules[item6.FieldEnName] = rule
                  if (item6.FieldEnName.indexOf('6') == 5) {
                    item6.FieldCnName = item6.FieldCnName.substr(5)
                    this.sideData[3].push(item6)
                  }

                  let item7 = Object.assign({}, item)
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
        this.getJunkDetail()
      })
    },
    getType(type){
      switch(type){
        case this.enums.SettingCustomizedFieldType.TextOfTextual:
          return ''
        case this.enums.SettingCustomizedFieldType.TextOfInteger:
          return 0
        case this.enums.SettingCustomizedFieldType.SelectOfEnums:
          return 0
        case this.enums.SettingCustomizedFieldType.TextOfDecimal:
          return 0
        case this.enums.SettingCustomizedFieldType.TextOfPercent:
          return 0
        case this.enums.SettingCustomizedFieldType.TextOfDate:
          return ''
        default:
          break
      }
    },
    removeValid(){
      // 切换时清除验证
      this.$refs['form'].resetFields()
    },
    // 图片上传成功
    uploadSucc(Key, row, name) {
      // this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      // this.form.ImageUrl = Key
      this.$set(row, name, Key)
    },
    uploadSucc1(Key) {
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.form.ImageUrl = Key
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
    getEv(name, arr){
      let lastStr = name.substring(name.length -2)
      console.log(name, arr, this.form)
      if(lastStr == 'Ek'){
        this.form[name.replace('Ek', 'Ev')] = arr.find(item => {
          return item.KeyId == this.form[name]||item.Id == this.form[name]
        }).Value
      }
    },
    saveData() {
      // 保存按钮
      const form = {...this.form}
      this.query = this.$route.query
      let params = {
        ChangeId: Number(this.query.ChangeId)||0
      }
      let api = STOCKING_API_JUNK_CHANGE_ORDER_ITEM_CREATE
      if (this.query.ItemId) {
        api = STOCKING_API_JUNK_CHANGE_ORDER_ITEM_UPDATE
        params.ItemId = parseInt(this.query.ItemId)
      }
      // 转换类型 
      // params.ChangeId = Number(this.query.ChangeId)||0
      // params.JunkId = Number(this.query.JunkId)||0
      // params.CostPrice = Number(this.query.CostPrice)||0
      console.log('form5', this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          console.log('this.allData', this.allData)
          this.allData.map(item => {
            if (item.Precision > 0 || item.FieldType == SettingCustomizedFieldType.TextOfPercent||item.FieldType == SettingCustomizedFieldType.TextOfDecimal) {
              form[item.FieldEnName] = this.$root.toInt(
                form[item.FieldEnName]
              )
            } else if (item.FieldType == SettingCustomizedFieldType.TextOfInteger) {
              form[item.FieldEnName] = Number(form[item.FieldEnName])
            }else if(item.FieldType == SettingCustomizedFieldType.SelectOfEnums){
              form[item.FieldEnName] = Number(form[item.FieldEnName])
            }
          })
          // 工费和工费类型
          form.CraftFee = this.$root.toInt(form.CraftFee)
          form.CraftType = Number(form.CraftType)
          api(
            Object.assign(form, params, {
              SeriesTypeName: this.enums.SeriesType.Types[form.SeriesType]
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/depot/junkChange/edit',
                query: {
                  id: this.query.ChangeId 
                }
              })
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    constPriceChange(value) {
      if (!value) {
        value = 0
      }
      // 修改时第一次进入页面成本价显示为CostPrice，之后为  成本 + 加工费
      if(!this.isComing){
        this.form.CostPrice = parseFloat(
          parseFloat(this.$root.toFloat(this.CostPrice - 0)) + parseFloat(value)
        ).toFixed(2)
      }else{
        this.isComing = false
      }
    },
    setGoodsName() {
      if (!this.type) {
        this.form.GoodsName =
          this.form.JunkName ||
          (this.form.Color || '') +
            (this.enums.GoldType.Types[this.form.GoldType] || '') +
            (this.enums.MaterialType.Types[this.form.MaterialType] || '') +
            (this.enums.CategoryType.Types[this.form.CategoryType] || '')
      }
    },
    getStoreAllType() {
      this.$store.dispatch('GET_STONE_TYPE')
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_SERIES_TYPE')
      // 财务分类 
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: this.SettingEnumeratorEnumeratorType.FinanceClassType
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          const obj = {
            Types: {},
            TypeArray: res.data.Data.Rows
          }
          this.$set(this.enums, 'FinanceClassType', obj)
        }
      })
      // 大类 
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: this.SettingEnumeratorEnumeratorType.LargeClassType
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          const obj = {
            Types: {},
            TypeArray: res.data.Data.Rows
          }
          this.$set(this.enums, 'LargeClassType', obj)
          console.log('LargeClassType', this.enums)
        }
      })
      // 小类 
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: this.SettingEnumeratorEnumeratorType.SmallClassType
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          const obj = {
            Types: {},
            TypeArray: res.data.Data.Rows
          }
          this.$set(this.enums, 'SmallClassType', obj)
        }
      })
    },
    async getAllType() {
      await this.setEnumsType('GoldType', 'goldType')
      await this.setEnumsType('MaterialType', 'materialType')
      await this.setEnumsType('CategoryType', 'categoryType')
      await this.setEnumsType('SeriesType', 'seriesType')
      await this.setEnumsType('PaymentType', 'paymentType')
      await this.setEnumsType('StoneClassType', 'stone')
    },
    setEnumsType(type1, type2) {
      return new Promise((resolve) => {
        let count = 0
        console.log('this.$store.getters[type2]', this.$store.getters.materialType)
        let fn = () => {
          if ((this.$store.getters[type2] && this.$store.getters[type2].TypeArray && this.$store.getters[type2].TypeArray.length) || count == 20) {
            this.$set(this.enums, type1, this.$store.getters[type2])
            resolve()
          } else {
            setTimeout(() => {
              count += 1
              fn()
            }, 100)
          }
        }
        fn()
      })
    }
  },
  created() {
    this.getStoreAllType()
  },
  async mounted() {
    this.query = this.$route.query
    if (!this.query.ChangeId || !this.query.JunkId) {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    }
    this.$store.commit('SET_FULL_LOADING', true) // table loading
    this.ChangeId = this.query.ChangeId
    this.JunkId = this.query.JunkId
    this.goodsId = this.query.id || 0
    this.ItemId = this.query.ItemId || 0
    // this.type = this.query.type || 0
    // this.CraftFee = Number(this.query.CraftFee) || 0
    // this.CraftType = Number(this.query.CraftType) || 0
    await this.getAllType()
    this.getForm()
    
  },
  watch: {
    'form.CategoryType': 'setGoodsName',
    'form.GoldType': 'setGoodsName',
    'form.MaterialType': 'setGoodsName',
    'form.Color': 'setGoodsName',
    'form.CraftFee': 'constPriceChange'
  },
  components: {
    uploadImg
  }
}
</script>
<style lang="scss">
.goodAdd-warpper {
  .el-col-8 {
    overflow: hidden;
    // height: 47px;
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
    min-height: 300px
  }
}
.oldGoods-add-box{
  .el-table__body-wrapper{
    overflow: auto!important;
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
  span {
    display: block;
    margin-top: 15px;
    color: #409EFF;
  }
}
</style>
