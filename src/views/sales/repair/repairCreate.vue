<template>
  <div class="content">
    <div class="panel" v-loading="detailLoading">
      <div class="panel-hd">
        <span class="title">{{$route.query.id?'编辑':'新建'}}维修单</span>
      </div>
      <!-- 信息 -->
      <el-form class="p-10" :rules="rules" :model="queryItems" label-width="110px" ref="createForm" v-loading="basicLoading">
        <div class="checkPage-hd">
          <el-row>
            <el-col>
              <span class="title">基本信息</span>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="维修项目：">
              <el-col :span="24" class="repair-items">
                <el-select multiple v-model="queryItems.PrepairTypeDks" @change="getPrepairTypeDvs" default-first-option filterable name="PrepairTypeDks">
                  <el-option v-for="(item, index) in repairReasons" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
                <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
                  <i class="icon-set"></i>
                </span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原消费单：">
              <el-input :maxlength="20" placeholder="输入原消费单" v-model="queryItems.SellCode" @keyup.enter.native="searchSaleCode" @blur="searchSaleCode" name="SellCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="会员：">
              <el-input :maxlength="50" placeholder="输入/扫描会员" @keyup.enter.native="searchVip" @blur="searchVip" v-model="queryItems.MemberId" name="memberId">
                <el-button slot="append" icon="el-icon-search" @click="vipDialog = true"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="顾客姓名：" prop="TrueName">
              <el-input :maxlength="10" placeholder="输入顾客姓名" v-model="queryItems.TrueName" name="TrueName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="顾客手机：" prop="Mobile">
              <el-input v-model="queryItems.Mobile" @blur="queryItems.Mobile=queryItems.Mobile.trim()" name="mobile" :maxlength="11" placeholder="输入顾客手机"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买日期：">
              <el-date-picker v-model="queryItems.RetailTime" type="date" name="RetailTime" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="取货方式：">
              <el-select v-model="queryItems.ShippingType" filterable clearable name="shippingType">
                <el-option v-for="(item, index) in ShippingType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" v-if="parseInt(queryItems.ShippingType) === ShippingType.Express">
            <el-form-item label="收货人姓名：">
              <el-input :maxlength="10" placeholder="输入收货人姓名" v-model="queryItems.ReceiptUser" name="receiver"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="parseInt(queryItems.ShippingType) === ShippingType.Express">
            <el-form-item label="收货人手机：">
              <el-input :maxlength="11" placeholder="输入收货人手机" v-model="queryItems.ReceiptPhone" name="receiverTel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="parseInt(queryItems.ShippingType) === ShippingType.Express">
          <el-col :span="24">
            <el-form-item label="收货人省市区：">
              <el-col :span="4">
                <el-cascader filterable :options="$store.getters.areas.slice(1)" ref="cascader" v-model="AreaData" placeholder="选择地区" @change="citiChange" name="AreaData"></el-cascader>
              </el-col>
              <el-col :span="20">
                <el-input :maxlength="50" placeholder="输入收货人详细地址" v-model="queryItems.Address" name="Address"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input placeholder="输入备注" :maxlength="50" v-model="queryItems.ReceiptNote" name="ReceiptNote"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form class="p-10" :rules="rules" :model="queryItems" label-width="110px" ref="goodsForm" v-loading="$store.getters.tb_loading">
        <div class="checkPage-hd">
          <el-row>
            <el-col>
              <span class="title">货品信息</span>
            </el-col>
          </el-row>
        </div>
        <!-- 货品信息 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="货品条码：">
              <el-input :maxlength="20" placeholder="输入货品条码" v-model="queryItems.BarCode" @keyup.enter.native="searchGoldCode" @blur="searchGoldCode" name="BarCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货品名称：" prop="GoodsName">
              <el-input :maxlength="20" placeholder="输入货品名称" v-model="queryItems.GoodsName" @blur="queryItems.GoodsName=queryItems.GoodsName.trim()" name="goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货重：">
              <el-input :maxlength="10" placeholder="输入货重" v-model="queryItems.Weight" @keyup.native="queryItems.Weight = $root.toFixed(queryItems.Weight, 3)" name="weight"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="材质：">
              <el-select v-model="queryItems.MaterialType" clearable name="materialType">
                <template v-for="(item, index) in $store.getters.materialType.TypeArray">
                  <el-option v-if="item.State !== YNStatus.No" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品类：">
              <el-select v-model="queryItems.CategoryType" clearable name="categoryType">
                <template v-for="(item, index) in $store.getters.categoryType.TypeArray">
                  <el-option v-if="item.State !== YNStatus.No" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成色：">
              <el-select v-model="queryItems.GoldType" clearable name="goldType">
                <template v-for="(item, index) in $store.getters.goldType.TypeArray">
                  <el-option v-if="item.State !== YNStatus.No" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="主石名称：">
              <el-input :maxlength="20" placeholder="输入主石名称" v-model="queryItems.StoneName" name="StoneName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主石重(ct)：">
              <el-input :maxlength="10" placeholder="输入主石重" v-model="queryItems.StoneWeight" @keyup.native="queryItems.StoneWeight = $root.toFixed(queryItems.StoneWeight, 3)" name="StoneWeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主石颜色：">
              <el-select v-model="queryItems.StoneColor" clearable name="stoneColor">
                <el-option v-for="(item,index)  in StoneColor.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="主石净度：">
              <el-select v-model="queryItems.StoneClarity" clearable name="stoneClarity">
                <el-option v-for="(item,index)  in StoneClarity.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主石切工：">
              <el-select v-model="queryItems.StoneCut" clearable name="stoneCut">
                <el-option v-for="(item,index)  in StoneCut.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货品估价：">
              <el-input :maxlength="10" placeholder="输入货品估价" v-model="queryItems.PrePrice" @keyup.native="queryItems.PrePrice = $root.toFixed(queryItems.PrePrice, 2)" name="prePrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="故障描述：">
              <el-input :maxlength="50" placeholder="输入故障描述" v-model="queryItems.FaultNote" name="FaultNote"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="图片：">
              <div class="photoWapper clearfix">
                <template v-for="(item,index) in photoList">
                  <div class="photo-box" v-if="item" :key="index">
                    <img :src="item.slice(0,4)==='http'? item : $root.settings.DOMAIN_IMG_FILE + item.replace('{0}', '150x150')">
                    <span @click="removePhoto(index)" name="btnRemovePhoto">X</span>
                  </div>
                </template>

                <div class="photo-box" v-if="photoList.length < 5">
                  <el-upload
                    class="avatar-uploader"
                    list-type="picture"
                    :action="uploadUrl"
                    :data="{Root: $root.filePaths.STOCKING_SALE + '/Repair'}"
                    :headers="{'access-token': $store.getters.access_token}"
                    :show-file-list="false"
                    name="Files"
                    accept="image/png, image/jpeg, image/jpg"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <p style="color: #777; line-height: 162px">最多可添加5张，限jpg、png格式</p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="buttons" v-if="$route.query.id">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave(false)" name="btnToSave">修改</el-button>
      <el-button type="primary" :loadidng="$store.getters.is_loading" @click="toSave(true)" name="btnToSaveAndTrue">修改并处理</el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="buttons" v-else>
      <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave(false)" name="btnToSave">保存</el-button>
      <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave(true)" name="btnToSaveAndTrue">保存并处理</el-button>
      <el-button @click="$router.go(-1)" name="btmGoBack">返回</el-button>
    </div>

    <!-- @module 会员选择 -->
    <MenberSelect :visible.sync="vipDialog" @getVipInfo="getVipInfo"></MenberSelect>
    <!-- end 会员选择 -->

    <!-- @module Dialog·新建维修原因 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="repairReasons" dialogTitle="维修项目" :dictType="SettingDictionaryDictType.GoodsRepairOrderBasicPrepairType" @listenDictSave="getRepairReason"></dict-manage>
    <!-- End Dialog·新建维修原因  -->
  </div>
</template>

<script>
import {
  YNStatus,
  ShippingType,
  ExpressType
} from '@/enums/common.js'
import { StoneColor, StoneClarity, StoneCut, SettingDictionaryDictType } from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST, } from '@/apis/merchant.js'
import {
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_UPDATE,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GET,
  STOCKING_API_GOODS_BASIC_FIND
} from '@/apis/stocking.js'
import { ORDER_API_RETAIL_ORDER_SELL_BASIC_GET } from '@/apis/order.js'
import { MEMBERSHIP_API_MEMBER_GETS } from '@/apis/membership.js'

import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import MenberSelect from '@/components/erp/menberSelect.vue'

export default {
  beforeRouteEnter(to, from, next) {
    if (to.query.id) {
      to.meta.name = '编辑维修单'
    } else {
      to.meta.name = '创建维修单'
    }
    next()
  },
  data() {
    return {
      YNStatus,
      ShippingType,
      ExpressType,
      StoneColor,
      StoneClarity,
      StoneCut,
      SettingDictionaryDictType,
      reasonDialog: false,
      repairReasons: [],
      queryItems: {
        PrepairTypeDks: [],
        PrepairTypeDvs: [],
        SellId: 0,
        SellCode: '', // String: 消费单号(营销系统)
        MasterId: 0, // Int64: 零售单序号
        MasterCode: '', // String:  零售单号
        MemberId: '', // String:  会员序号
        OpenId: '',
        TrueName: '', // String: 会员姓名
        AliasName: '',
        Birthday: '',
        SexyType: 0,
        VipTime: '',
        Mobile: '', // String: 会员手机
        RetailTime: '', // DateTime:  销售日期
        ShippingType: '', // Int32:  取货方式(枚举)
        ExpressType: '', // Int32:  快递类型(枚举)
        ExpressCode: '', // String:  快递单号
        ReceiptUser: '', // String:  收货人
        ReceiptPhone: '', // String:  收货人电话
        ProvinceId: 0, // Int32: 省份序号
        ProvinceName: '', // String:  省份名称
        CityId: 0, // Int32:  城市序号
        CityName: '', // String:  城市名称
        TownId: 0, // Int32:  区镇序号
        TownName: '', // String:  区镇名称
        Address: '', // String: 详细地址
        ReceiptNote: '', // String:  备注
        CategoryType: '',
        MaterialType: '',
        GoldType: '',
        StoneName: '',
        StoneColor: '',
        StoneClarity: '',
        StoneCut: '',
        StoneWeight: '',
        Weight: '',
        GoodsName: '',
        GoodsId: ''
      },
      detailLoading: false,
      basicLoading: false,
      AreaData: [],
      vipDialog: false,
      uploadUrl: this.$root.settings.DOMAIN_APIS.Common + '/Upload/Image/UploadToOss/', // 上传货品图片地址
      photoList: [],
      rules: {
        GoodsName: [
          {
            required: true, message: '请输入货品名称', trigger: 'blur'
          }
        ],
        TrueName: [
          {
            required: true, message: '请输入顾客名字', trigger: 'blur'
          }
        ],
        Mobile: [
          {
            required: true, message: '请输入顾客电话', trigger: 'blur',
          }
        ]
      }
    }
  },
  methods: {
    // 选择城市
    init() {
      if (this.$route.query.id) {
        this.detailLoading = true
        STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GET({ RepairId: this.$route.query.id }).then(res => {
          if (res.data.Code === 'CORRECT') {
            let data = res.data.Data
            this.AreaData = [String(data.ProvinceId), String(data.CityId), String(data.TownId)]
            this.photoList = data.ImageUrls.split(',')
            data.PrepairTypeDks = data.PrepairTypeDks ? data.PrepairTypeDks.split(',') : []
            data.PrepairTypeDvs = data.PrepairTypeDvs ? data.PrepairTypeDvs.split(',') : []
            data.RetailTime = data.RetailTime.slice(0, 4) === '1900' ? '' : data.RetailTime
            data.ShippingType = data.ShippingType || ''
            data.MaterialType = data.MaterialType || ''
            data.CategoryType = data.CategoryType || ''
            data.GoldType = data.GoldType || ''
            data.StoneColor = data.StoneColor || ''
            data.StoneClarity = data.StoneClarity || ''
            data.StoneCut = data.StoneCut || ''
            data.Weight = data.Weight ? this.$root.toFloat(data.Weight, 3) : ''
            data.StoneWeight = data.StoneWeight ? this.$root.toFloat(data.StoneWeight, 3) : ''
            data.PrePrice = data.PrePrice ? this.$root.toFloat(data.PrePrice) : ''
            this.queryItems = { ...this.queryItems, ...res.data.Data }
          }
          this.detailLoading = false
        })
      }
    },
    citiChange(area) {
      // 选择省市区后执行将cityname赋值给form
      let cityName = this.$refs.cascader.currentLabels
      this.queryItems.ProvinceName = cityName[0]
      this.queryItems.CityName = cityName[1]
      this.queryItems.TownName = cityName[2]
      this.queryItems.ProvinceId = parseInt(area[0]) || 0
      this.queryItems.CityId = parseInt(area[1]) || 0
      this.queryItems.TownId = parseInt(area[2]) || 0
    },
    getPrepairTypeDvs(val) {
      this.queryItems.PrepairTypeDvs = []
      this.repairReasons.forEach(item => {
        if (val.some(id => id === item.Id)) {
          this.queryItems.PrepairTypeDvs.push(item.Value)
        }
      })
    },
    toSave(boolean) {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$refs['goodsForm'].validate(valid => {
            if (valid) {
              this.$store.commit('SET_BTN_LOADING', true)
              let params = { ...this.queryItems }
              params.ShippingType = parseInt(params.ShippingType) || 0
              params.ExpressType = parseInt(params.ExpressType) || 0
              params.MaterialType = parseInt(params.MaterialType) || 0
              params.CategoryType = parseInt(params.CategoryType) || 0
              params.GoldType = parseInt(params.GoldType) || 0
              params.StoneColor = parseInt(params.StoneColor) || 0
              params.StoneClarity = parseInt(params.StoneClarity) || 0
              params.StoneCut = parseInt(params.StoneCut) || 0
              params.StoneWeight = this.$root.toInt(params.StoneWeight)
              params.Weight = this.$root.toInt(params.Weight)
              params.ImageUrls = this.photoList.join(',')
              params.PrepairTypeDks = params.PrepairTypeDks.join(',')
              params.PrepairTypeDvs = params.PrepairTypeDvs.join(',')
              params.PrePrice = this.$root.toInt(params.PrePrice)
              let api = this.$route.query.id ? STOCKING_API_GOODS_REPAIR_ORDER_BASIC_UPDATE : STOCKING_API_GOODS_REPAIR_ORDER_BASIC_CREATE

              api(params).then(res => {
                this.$store.commit('SET_BTN_LOADING', false)
                if (res.data.Code === 'CORRECT') {
                  this.$message.success('提交成功')
                  if (!boolean) {
                    this.$router.push({
                      path: '/sales/repair/index'
                    })
                  } else {
                    this.$router.push({
                      path: '/sales/repair/repairCheck',
                      query: {
                        id: this.$route.query.id ? this.queryItems.RepairId : res.data.Data,
                        stageDialog: 1
                      }
                    })
                  }
                } else {
                  this.$message.error(res.data.Message)
                }
              })
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    getRepairReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.GoodsRepairOrderBasicPrepairType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.repairReasons = res.data.Data.Rows || []
        }
      })
    },
    searchVip() {
      // 搜索vip
      if (!this.queryItems.MemberId) {
        return false
      }
      this.basicLoading = true
      let vipParams = {
        PageIndex: '1',
        PageSize: '10',
        Mobile: '',
        AliasName: '',
        MemberId: this.queryItems.MemberId,
        SexyType: '',
        TrueName: '',
        CreateTime1: '1900-01-01',
        CreateTime2: '1900-01-01',
        Birthday1: '1900-01-01',
        Birthday2: ' 1900-01-01'
      }
      MEMBERSHIP_API_MEMBER_GETS(vipParams).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data.rows.length) {
            this.$message.error('该会员不存在!')
            this.queryItems.TrueName = ''
            this.queryItems.Mobile = ''
          } else {
            this.getVipInfo(res.data.Data.rows[0])
          }
        } else {
          this.queryItems.TrueName = ''
          this.queryItems.Mobile = ''
          this.$message.error(res.Message)
        }
        this.basicLoading = false
      })
    },
    getVipInfo(data) {
      // 获取vip信息
      this.vipDialog = false
      this.queryItems.MemberId = data.memberId
      this.queryItems.TrueName = data.trueName
      this.queryItems.AliasName = data.aliasName
      this.queryItems.Birthday = data.birthday
      this.queryItems.Mobile = data.mobile
      this.queryItems.SexyType = data.sexyType
      this.queryItems.VipTime = data.joinTime && data.joinTime.slice(0, 4) === '1900' ? data.joinTime : ''
    },
    handleAvatarSuccess(res) {
      if (res.Code === 'CORRECT') {
        this.photoList.push(res.Data.Path[0])
      } else {
        this.$message.error(res.Message)
      }
    },
    // 上传图片校验
    beforeAvatarUpload(file) {
      let imgTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (imgTypes.indexOf(file.type) === -1) {
        this.$message.error('请选择png,jpg格式图片上传!')
        return false
      } else {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
          return false
        }
      }
      return true
    },
    removePhoto(i) {
      this.photoList.splice(i, 1)
    },
    searchSaleCode() {
      if (!this.queryItems.SellCode) {
        return false
      }
      this.basicLoading = true
      ORDER_API_RETAIL_ORDER_SELL_BASIC_GET({
        SellCode: this.queryItems.SellCode
      }).then((res) => {
        if (!res.data.Data) {
          this.$message.error('该消费单不存在!')
        } else {
          this.queryItems = Object.assign(this.queryItems, {
            SellId: res.data.Data.SellId,
            MasterId: res.data.Data.MasterId,
            // MasterCode: res.data.Data.MasterCode,
            MemberId: res.data.Data.MemberId,
            TrueName: res.data.Data.TrueName,
            Mobile: res.data.Data.Mobile,
            RetailTime: res.data.Data.CreateTime,
            OpenId: res.data.Data.OpenId
          })
          res.data.Data.StoreBarCode ? this.queryItems.BarCode = res.data.Data.StoreBarCode : this.queryItems.BarCode = ''
          this.photoList = []
          res.data.Data.ImageUrl && this.photoList.push(res.data.Data.ImageUrl)
          
          this.searchVip()
          this.searchGoldCode()
        }
        this.basicLoading = false
      })
    },
    searchGoldCode() {
      if (!this.queryItems.BarCode) {
        return false
      }
      // 搜索货品源码
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_BASIC_FIND({
        BarCode: this.queryItems.BarCode
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data === null) {
            this.$message.error('该条码不存在!')
            this.queryItems.GoodsName = ''
          } else {
            this.photoList = []
            this.queryItems.GoodsId = res.data.Data.GoodsId
            this.queryItems.GoodsName = res.data.Data.GoodsName
            this.queryItems.Weight =  res.data.Data.Weight ? this.$root.toFloat(res.data.Data.Weight, 3) : ''
            this.queryItems.MaterialType = res.data.Data.MaterialType || ''
            this.queryItems.CategoryType = res.data.Data.CategoryType || ''
            this.queryItems.GoldType = res.data.Data.GoldType || ''
            this.queryItems.StoneName = res.data.Data.Stone1Name
            this.queryItems.StoneWeight = res.data.Data.Stone1Weight ? this.$root.toFloat(res.data.Data.Stone1Weight, 3) : ''
            this.queryItems.StoneColor = res.data.Data.Stone1Color || ''
            this.queryItems.StoneClarity = res.data.Data.Stone1Clarity || ''
            this.queryItems.StoneCut = res.data.Data.Stone1Cut || ''
            res.data.Data.ImageUrl && this.photoList.push(res.data.Data.ImageUrl)
          }
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    getAreaData() {
      this.$store.dispatch('GET_AREAS_DROPLIST')
    }
  },
  created() {
    this.getStoreAllType()
    this.getAreaData()
  },
  mounted() {
    this.getRepairReason()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryItems.ShippingType'() {
      if (
        parseInt(this.queryItems.ShippingType) === this.ShippingType.Express
      ) {
        this.queryItems.ReceiptUser = this.queryItems.TrueName
        this.queryItems.ReceiptPhone = this.queryItems.Mobile
      }
    }
  },
  components: {
    MenberSelect,
    dictManage,
    pagination
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  max-width: none;
}
.el-tag--small {
  max-width: 90px !important;
}
.el-select__tags-text {
  max-width: 90px !important;
}

.inventor-title-form {
  width: 100%;
  padding: 5px 20px;
  overflow: hidden;
}
.inventor-title-form .left-title {
  margin-top: 3px;
  text-align: left;
}
.inventor-title-form .right-title {
  line-height: 30px;
  text-align: right;
}
.inventor-title-form .right-title span {
  margin-right: 10px;
  font-size: 14px;
}
.inventor-title-form .right-title span b {
  font-size: 16px;
}
.infoTitle {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.photoWapper {
  border: 1px solid #ededed;
}
.photoWapper .photo-box {
  width: 200px;
  position: relative;
  float: left;
  margin: 5px;
  line-height: 0;
}
.photoWapper .photo-box span {
  position: absolute;
  top: -6px;
  right: -6px;
  font-weight: bold;
  width: 18px;
  border-radius: 50%;
  background: #555;
  color: #fff;
  font-size: 8px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
}
.photoWapper .photo-box span:hover {
  background: rgba(0, 0, 0, 0.9);
}
.photoWapper .photo-box img {
  width: 200px;
  height: auto;
  max-height: 150px;
  min-height: 150px;
}

.avatar-uploader {
  text-align: center;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

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
.repair-items {
  padding: 0 !important;
  width: 100%;
  .el-select {
    width: calc(100% - 50px);
    max-width: 1500px;
    .el-input {
      width: 100% !important;
      max-width: 1500px;
    }
  }
}
</style>
