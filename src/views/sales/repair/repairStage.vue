<template>
  <div>
    <el-dialog title="维修单进度" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="resetForm">
      <div v-loading="$store.getters.tb_loading">
        <div class="buttons">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="新建"></el-step>
            <el-step title="维修处理"></el-step>
            <el-step title="完成维修"></el-step>
            <el-step title="收款"></el-step>
            <el-step title="返还顾客"></el-step>
          </el-steps>
        </div>
        <!-- 步骤2 -->
        <div v-show="active === 1">
          <el-form ref="createForm1" :model="queryForm" label-width="130px" :rules="rules1">
            <el-form-item label="单据编号：">
              <el-input :value="repairState.RepairCode" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="创建：">
              <el-input :value="repairState.CreateTime | filterDateMinutes" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="顾客信息：">
              <el-input :value="repairState.TrueName + ' - ' + repairState.Mobile" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="货品信息：">
              <el-input :value="repairState.GoodsName" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="维修地点：" prop="PlaceType">
              <el-radio-group v-model="queryForm.PlaceType">
                <el-radio v-for="(item, index) in GoodsRepairOrderBasicPlaceType.Types" :key="index" :label="parseInt(index)">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="PartnerId" label="供应商：" v-if="queryForm.PlaceType === GoodsRepairOrderBasicPlaceType.Factory">
              <el-select v-model="queryForm.PartnerId" placeholder="请选择" :filterable="true">
                <template v-for="(item, index) in $store.getters.suppliers">
                  <el-option :key="index" v-if="item.State === YNStatus.Yes" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="RepairTypeDks" label="实际维修项目：">
              <el-select v-model="queryForm.RepairTypeDks" multiple style="width:90%;" placeholder="请选择" name="RepairTypeDks">
                <el-option v-for="(item, index) in repairReasons" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </el-select>
              <span class="icon-set-item" @click="reasonDialog=true">
                <i class="icon-set"></i>
              </span>
            </el-form-item>
            <el-form-item prop="PrepairPrice" label="预估维修费(元)：">
              <el-input v-model="queryForm.PrepairPrice" placeholder="请输入预估维修费" :maxlength="10" @keyup.native="queryForm.PrepairPrice = $root.toFixed(queryForm.PrepairPrice, 2)" name="PrepairPrice"></el-input>
            </el-form-item>
            <el-form-item prop="PrepairTime" label="预计完成日期：">
              <el-date-picker v-model="queryForm.PrepairTime" type="date" value-format="yyyy-MM-dd"> </el-date-picker>
            </el-form-item>
            <el-form-item prop="PrepairNote" label="备注：">
              <el-input v-model="queryForm.PrepairNote" placeholder="请输入备注" :maxlength="200" name="PrepairNote"></el-input>
            </el-form-item>
          </el-form>
          <div class="tr">
            <el-button :loading="$store.getters.is_loading" @click="toSave1(false)" name="btnToSave1">保存</el-button>
            <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave1(true)" name="btnToSaveAndChange1">保存并下一步</el-button>
            <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
          </div>
        </div>
        <!-- 步骤3 -->
        <div v-show="active === 2">
          <el-form ref="createForm2" :model="queryForm2" label-width="130px" :rules="rules2">
            <el-form-item label="单据编号：">
              <el-input :value="repairState.RepairCode" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="创建：">
              <el-input :value="repairState.CreateTime | filterDateMinutes" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="顾客信息：">
              <el-input :value="repairState.TrueName + ' - ' + repairState.Mobile" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="货品信息：">
              <el-input :value="repairState.GoodsName" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="维修地点">
              <el-input :value="GoodsRepairOrderBasicPlaceType.Types[repairState.PlaceType]" disabled></el-input>
            </el-form-item>
            <el-form-item label="维修项目：">
              <el-input :value="repairState.RepairTypeDvs" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="预估维修费(元)：">
              <el-input :value="$root.toFloat(repairState.PrepairPrice)" placeholder="请输入预估维修费" :maxlength="9" disabled></el-input>
            </el-form-item>
            <el-form-item prop="RepairPrice" label="实际维修费(元)：">
              <el-input v-model="queryForm2.RepairPrice" placeholder="请输入实际维修费" :maxlength="10" @keyup.native="queryForm2.RepairPrice = $root.toFixed(queryForm2.RepairPrice, 2)" name="RepairPrice"></el-input>
            </el-form-item>
            <el-form-item prop="RepairNote" label="备注：">
              <el-input v-model="queryForm2.RepairNote" placeholder="请输入备注" :maxlength="200" name="RepairNote"></el-input>
            </el-form-item>
          </el-form>
          <div class="tr">
            <el-button :loading="$store.getters.is_loading" @click="toSave2(false)" name="btnToSave2">保存</el-button>
            <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave2(true)" name="btnToSaveAndChange2">保存并下一步</el-button>
            <el-button @click="$emit('update:visible', false)" name="btnClose2">关闭</el-button>
          </div>
        </div>
        <!-- 步骤4 -->
        <div v-show="active === 3">
          <el-form ref="createForm3" :model="queryForm3" label-width="130px" :rules="rules3">
            <el-form-item label="单据编号：">
              <el-input :value="repairState.RepairCode" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="创建：">
              <el-input :value="repairState.CreateTime | filterDateMinutes" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="顾客信息：">
              <el-input :value="repairState.TrueName + ' - ' + repairState.Mobile" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="货品信息：">
              <el-input :value="repairState.GoodsName" disabled :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="应收款(元)：">
              <el-input :value="$root.toFloat(repairState.RepairPrice)" disabled :maxlength="9"></el-input>
            </el-form-item>
            <el-form-item label="实收款(元)：" prop="PaidPrice">
              <el-input v-model="queryForm3.PaidPrice" placeholder="请输入实收款" @keyup.native="queryForm3.PaidPrice = $root.toFixed(queryForm3.PaidPrice, 2)" :maxlength="10" name="paidPrice"></el-input>
            </el-form-item>
            <el-form-item label="收款方式：" prop="PaymentTypeEk">
              <el-select v-model="queryForm3.PaymentTypeEk" @change="getPaymentTypeEv" name="paymentType">
                <el-option v-for="(item, index) in $store.getters.paymentType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="PaidNote" label="备注：">
              <el-input v-model="queryForm3.PaidNote" placeholder="请输入备注" :maxlength="200" name="PaidNote"></el-input>
            </el-form-item>
          </el-form>
          <div class="tr">
            <el-button :loading="$store.getters.is_loading" @click="toSave3(false)" name="btnToSave3">保存</el-button>
            <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave3(true)" name="toSave3(true)">保存并下一步</el-button>
            <el-button @click="$emit('update:visible', false)" name="btnClose3">关闭</el-button>
          </div>
        </div>

        <!-- 步骤5 -->
        <div v-show="active === 4">
          <el-form ref="createForm4" :model="queryForm4" label-width="130px">
            <el-form-item label="单据编号：">
              <el-input :value="repairState.RepairCode" disabled :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="创建：">
              <el-input :value="repairState.CreateTime | filterDateMinutes" disabled :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="顾客信息：">
              <el-input :value="repairState.TrueName + ' - ' + repairState.Mobile" disabled :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="货品信息：">
              <el-input :value="repairState.GoodsName" disabled :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item prop="ShippingType" label="取货方式：">
              <el-radio-group v-model="queryForm4.ShippingType" name="shippingType">
                <el-radio :label="ShippingType.PickedUp">自提</el-radio>
                <el-radio :label="ShippingType.Express">快递</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="queryForm4.ShippingType === ShippingType.Express">
              <el-form-item prop="ReceiptUser" label="收货人姓名：">
                <el-input v-model="queryForm4.ReceiptUser" placeholder="请输入收货人姓名" :maxlength="10" name="ReceiptUser"></el-input>
              </el-form-item>
              <el-form-item prop="ReceiptPhone" label="收货人手机：">
                <el-input v-model="queryForm4.ReceiptPhone" placeholder="请输入收货人手机" :maxlength="20" name="ReceiptPhone"></el-input>
              </el-form-item>
              <el-form-item prop="Address" label="收货人地址：">
                <el-cascader filterable :options="$store.getters.areas.slice(1)" ref="cascader" v-model="AreaData" placeholder="选择地区" @change="citiChange" name="areaData"></el-cascader>
                <el-input v-model="queryForm4.Address" placeholder="请输入收货人详细地址" :maxlength="50" name="address" class="m-t-10"></el-input>
              </el-form-item>
              <el-form-item prop="ExpressType" label="快递公司：">
                <el-select v-model="queryForm4.ExpressType" filterable placeholder="请选择" name="expressType">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="(item, index) in ExpressType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="ExpressCode" label="快递单号：">
                <el-input v-model="queryForm4.ExpressCode" placeholder="请输入快递单号" :maxlength="20" name="expressCode"></el-input>
              </el-form-item>
            </div>
            <el-form-item prop="ReceiptNote" label="备注：">
              <el-input v-model="queryForm4.ReceiptNote" placeholder="请输入备注" :maxlength="50" name="ReceiptNote"></el-input>
            </el-form-item>
          </el-form>
          <div class="tr">
            <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave4" name="btnToSave4">保存</el-button>
            <el-button @click="$emit('update:visible', false)" name="btnClose4">关闭</el-button>
          </div>
        </div>

        <!-- end -->
      </div>
    </el-dialog>

    <!-- @module Dialog·新建维修原因 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="repairReasons" dialogTitle="维修项目" :dictType="SettingDictionaryDictType.GoodsRepairOrderBasicPrepairType" @listenDictSave="getRepairReason"></dict-manage>
    <!-- End Dialog·新建维修原因  -->
  </div>
</template>

<script>
import { YNStatus, ShippingType, ExpressType } from '@/enums/common.js'
import { GoodsRepairOrderBasicStepState, GoodsRepairOrderBasicPlaceType, SettingDictionaryDictType } from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import {
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEREPAIR,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_FINISHREPAIR,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEPAID,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_RETURN
} from '@/apis/stocking.js'

import dictManage from '@/components/erp/dictManage'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    repairState: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      YNStatus,
      ShippingType,
      ExpressType,
      SettingDictionaryDictType,
      GoodsRepairOrderBasicPlaceType,
      GoodsRepairOrderBasicStepState,
      queryForm: {
        RepairId: '',
        PlaceType: '',
        PartnerId: '',
        RepairTypeDks: [],
        PrepairPrice: 0,
        PrepairTime: '',
        PrepairNote: ''
      },
      queryForm2: {
        RepairPrice: '',
        RepairNote: '',
      },
      queryForm3: {
        PaymentTypeEk: '',
        PaidPrice: '',
        PaidNote: ''
      },
      queryForm4: {
        ReceiptUser: '',
        ReceiptPhone: '',
        Address: '',
        ExpressType: '',
        ShippingType: '',
        ReceiptNote: ''
      },
      active: 0,
      AreaData: [],
      repairReasons: [],
      reasonDialog: false,
      rules1: {
        PlaceType: [
          {
            type: 'number',
            required: true,
            message: '请选择维修地点',
            trigger: 'change'
          }
        ]
      },
      rules2: {
        RepairPrice: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入实际维修费'))
              } else if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0') {
                callback(new Error('必须为数字'))
              }
              callback()
            }
          }
        ]
      },
      rules3: {
        PaidPrice: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入实收款'))
              } else if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0') {
                callback(new Error('必须为数字'))
              }
              callback()
            }
          }
        ],
        PaymentTypeEk: [
          {
            type: 'number',
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: {
    dictManage
  },
  watch: {
    visible: 'showStep',
    repairState(detail) {
      if (JSON.stringify(detail) !== '{}') {
        // this.repairState.PrepairPrice = this.$root.toFloat(detail.PrepairPrice)
        this.queryForm.RepairId = detail.RepairId
        this.queryForm.PlaceType = detail.PlaceType || ''
        this.queryForm.PartnerId = detail.PartnerId || ''
        this.queryForm.RepairTypeDks = detail.RepairTypeDks ? detail.RepairTypeDks.split(',') : []
        this.queryForm.PrepairPrice = this.$root.toFloat(detail.PrepairPrice)
        this.queryForm.PrepairTime = detail.PrepairTime.slice(0, 4) === '1900' ? '' : detail.PrepairTime
        this.queryForm3.PaidPrice = detail.RepairPrice ? this.$root.toFloat(detail.RepairPrice) : ''
        this.queryForm4.ShippingType = detail.ShippingType || ShippingType.PickedUp
        this.queryForm4.ReceiptUser = detail.ReceiptUser
        this.queryForm4.ReceiptPhone = detail.ReceiptPhone
        this.queryForm4.ProvinceId = detail.ProvinceId
        this.queryForm4.ProvinceName = detail.ProvinceName
        this.queryForm4.CityId = detail.CityId
        this.queryForm4.CityName = detail.CityName
        this.queryForm4.TownId = detail.TownId
        this.queryForm4.TownName = detail.TownName
        this.queryForm4.Address = detail.Address
        this.AreaData = [String(detail.ProvinceId), String(detail.CityId), String(detail.TownId)]
      }
    }
  },
  created() {
    this.getRepairReason()
    this.getEnums()
  },
  mounted() {

  },
  methods: {
    resetForm() {
      this.$refs['createForm1'].resetFields()
      this.$refs['createForm2'].resetFields()
      this.$refs['createForm3'].resetFields()
      this.$refs['createForm4'].resetFields()
      this.AreaData = [String(this.repairState.ProvinceId), String(this.repairState.CityId), String(this.repairState.TownId)]
    },
    getPaymentTypeEv(id) {
      this.queryForm3.PaymentTypeEv = this.$store.getters.paymentType.Types[id]
    },
    getEnums() {
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_AREAS_DROPLIST')
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    showStep() {
      switch (this.repairState.StepState) {
        case this.GoodsRepairOrderBasicStepState.Wait:
          this.active = 1
          break
        case this.GoodsRepairOrderBasicStepState.Repairing:
          this.active = 2
          break
        case this.GoodsRepairOrderBasicStepState.Paid:
          this.active = 3
          break
        case this.GoodsRepairOrderBasicStepState.Return:
          this.active = 4
          break
        default:
          break
      }
    },

    // 选择城市
    citiChange(area) {
      // 选择省市区后执行将cityname赋值给form
      let cityName = this.$refs.cascader.currentLabels
      this.queryForm4.ProvinceName = cityName[0]
      this.queryForm4.CityName = cityName[1]
      this.queryForm4.TownName = cityName[2]
      this.queryForm4.ProvinceId = parseInt(area[0]) || 0
      this.queryForm4.CityId = parseInt(area[1]) || 0
      this.queryForm4.TownId = parseInt(area[2]) || 0
    },
    getRepairReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.GoodsRepairOrderBasicPrepairType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.repairReasons = res.data.Data.Rows
        }
      })
    },
    // 按钮事件
    toSave1(boolean) {
      // 步骤1
      this.$refs['createForm1'].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let repairTypeDvs = []
          this.repairReasons.forEach(item => {
            if (this.queryForm.RepairTypeDks.some(id => parseInt(id) === item.Id)) {
              repairTypeDvs.push(item.Value)
            }
          })
          this.queryForm.RepairTypeDvs = repairTypeDvs.join(',')
          let params = { ...this.queryForm }
          params.RepairTypeDks = params.RepairTypeDks.join(',')
          params.PrepairPrice = this.$root.toInt(params.PrepairPrice)
          params.PartnerId = params.PartnerId || 0
          params.PrepairTime = params.PrepairTime ? params.PrepairTime : '1900-01-01 00:00:00'
          STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEREPAIR(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$emit('listenstageDialog')
              if (!boolean) {
                this.$emit('update:visible', false)
              } else {
                this.repairState.RepairTypeDvs = this.queryForm.RepairTypeDvs
                this.repairState.PlaceType = this.queryForm.PlaceType
                this.repairState.PrepairPrice = this.$root.toInt(parseFloat(this.queryForm.PrepairPrice))
                this.active += 1
              }
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    toSave2(boolean) {
      // 步骤2
      this.$refs['createForm2'].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_REPAIR_ORDER_BASIC_FINISHREPAIR({
            RepairId: this.repairState.RepairId,
            RepairPrice: this.$root.toInt(this.queryForm2.RepairPrice * 1),
            RepairNote: this.queryForm2.RepairNote
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$emit('listenstageDialog')
              if (!boolean) {
                this.$emit('update:visible', false)
              } else {
                this.repairState.RepairPrice = this.$root.toInt(this.queryForm2.RepairPrice * 1)
                this.active += 1
              }
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    toSave3(boolean) {
      // 步骤3
      this.$refs['createForm3'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEPAID({
            RepairId: this.repairState.RepairId,
            PaidPrice: this.$root.toInt(this.queryForm3.PaidPrice),
            PaymentTypeEk: this.queryForm3.PaymentTypeEk,
            PaymentTypeEv: this.queryForm3.PaymentTypeEv,
            PaidNote: this.queryForm3.PaidNote
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$emit('listenstageDialog')
              if (!boolean) {
                this.$emit('update:visible', false)
              } else {
                this.active += 1
              }
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    toSave4() {
      // 步骤4
      this.$refs['createForm4'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let params = {
          }
          if (this.queryForm4.ShippingType === ShippingType.Express) {
            params = {
              RepairId: this.repairState.RepairId,
              ShippingType: this.queryForm4.ShippingType, // Int32: 取货方式(枚举)
              ExpressType: this.queryForm4.ExpressType || 0, // Int32:  快递类型(枚举)
              ExpressCode: this.queryForm4.ExpressCode, // String: 快递单号
              ReceiptUser: this.queryForm4.ReceiptUser, // String: 收货人
              ReceiptPhone: this.queryForm4.ReceiptPhone, // String: 收货人电话
              ProvinceId: this.queryForm4.ProvinceId || 0, // Int32:  省份序号
              ProvinceName: this.queryForm4.ProvinceName, // String 省份名称
              CityId: this.queryForm4.CityId || 0, // Int32 城市序号
              CityName: this.queryForm4.CityName, // String 城市名称
              TownId: this.queryForm4.TownId || 0, // Int32 区镇序号
              TownName: this.queryForm4.TownName, // String 区镇名称
              Address: this.queryForm4.Address, // String 详细地址
              ReceiptNote: this.queryForm4.ReceiptNote // String 维修序号
            }
          } else {
            params = {
              RepairId: this.repairState.RepairId,
              ShippingType: this.queryForm4.ShippingType, // Int32: 取货方式(枚举)
              ExpressType: 0, // Int32:  快递类型(枚举)
              ExpressCode: '', // String: 快递单号
              ReceiptUser: '', // String: 收货人
              ReceiptPhone: '', // String: 收货人电话
              ProvinceId: 0, // Int32:  省份序号
              ProvinceName: '', // String 省份名称
              CityId: 0, // Int32 城市序号
              CityName: '', // String 城市名称
              TownId: 0, // Int32 区镇序号
              TownName: '', // String 区镇名称
              Address: '', // String 详细地址
              ReceiptNote: this.queryForm4.ReceiptNote // String 维修序号
            }
          }

          STOCKING_API_GOODS_REPAIR_ORDER_BASIC_RETURN(params).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$emit('listenstageDialog')
              this.$emit('update:visible', false)
              this.$route.back()
            }
          })
        }
      })
    }
  },

}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 18px;
}
body .el-tag .el-select__tags-text {
  max-width: 90px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>

